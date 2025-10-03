import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

/**
 * @swagger
 * /api/alumni:
 *   get:
 *     summary: Get a list of alumni with pagination and filters.
 *     description: Retrieve a paginated list of alumni, with optional filtering by search term, major, and graduation year range.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *         description: The number of items per page.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter alumni by name, current job title, or company.
 *       - in: query
 *         name: major
 *         schema:
 *           type: string
 *           default: Semua
 *         description: Filter alumni by major. Use 'Semua' for all majors.
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *           enum: [Semua, 2005-2009, 2010-2015, 2016-2020, 2021-Sekarang]
 *           default: Semua
 *         description: Filter alumni by graduation year range. Use 'Semua' for all years.
 *     responses:
 *       200:
 *         description: A paginated list of alumni.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 alumni:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       slug:
 *                         type: object
 *                         properties:
 *                           current:
 *                             type: string
 *                       yearGraduated:
 *                         type: integer
 *                       major:
 *                         type: string
 *                       profileImageUrl:
 *                         type: string
 *                       currentJob:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           company:
 *                             type: string
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 itemsPerPage:
 *                   type: integer
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '8');
  const searchTerm = searchParams.get('search') || '';
  const major = searchParams.get('major') || 'Semua';
  const yearRange = searchParams.get('year') || 'Semua';

  try {
    // Buat filter conditions
    let filterConditions = [];
    
    // Filter berdasarkan jurusan
    if (major && major !== 'Semua') {
      filterConditions.push(`major == "${major}"`);
    }
    
    // Filter berdasarkan rentang tahun
    if (yearRange && yearRange !== 'Semua') {
      if (yearRange === '2005-2009') {
        filterConditions.push(`yearGraduated >= 2005 && yearGraduated <= 2009`);
      } else if (yearRange === '2010-2015') {
        filterConditions.push(`yearGraduated >= 2010 && yearGraduated <= 2015`);
      } else if (yearRange === '2016-2020') {
        filterConditions.push(`yearGraduated >= 2016 && yearGraduated <= 2020`);
      } else if (yearRange === '2021-Sekarang') {
        filterConditions.push(`yearGraduated >= 2021`);
      }
    }
    
    // Filter berdasarkan pencarian
    if (searchTerm && searchTerm.trim() !== '') {
      filterConditions.push(
        `(name match "*${searchTerm}*" || 
          coalesce(currentJob.title, "") match "*${searchTerm}*" || 
          coalesce(currentJob.company, "") match "*${searchTerm}*")`
      );
    }
    
    // Membuat filter query
    const filterQuery = filterConditions.length > 0 
      ? ` && ${filterConditions.join(' && ')}` 
      : '';
    
    // Buat query untuk menghitung total
    const countQuery = `count(*[
      _type == "alumni"
      && defined(slug.current)
      ${filterQuery}
    ])`;
    
    // Buat query untuk mengambil data dengan pagination
    const alumniQuery = `*[
      _type == "alumni"
      && defined(slug.current)
      ${filterQuery}
    ]|order(yearGraduated desc)[${(page - 1) * limit}...${page * limit}]{
      _id, 
      name, 
      slug,
      yearGraduated,
      major,
      "profileImageUrl": profileImage.asset->url,
      currentJob
    }`;
    
    // Ambil data dan total items
    const [alumni, totalItems] = await Promise.all([
      client.fetch(alumniQuery),
      client.fetch(countQuery)
    ]);
    
    // Hitung total halaman
    const totalPages = Math.ceil(totalItems / limit);
    
    return NextResponse.json({ 
      alumni, 
      totalItems, 
      totalPages,
      currentPage: page,
      itemsPerPage: limit
    });
  } catch (error) {
    console.error('Error mengambil data alumni:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data alumni' },
      { status: 500 }
    );
  }
}
