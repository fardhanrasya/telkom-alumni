import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

/**
 * @swagger
 * /api/karir:
 *   get:
 *     summary: Get a list of job postings with pagination and filters.
 *     description: Retrieve a paginated list of job postings, with optional filtering by search term, job type, and workplace type.
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
 *         description: Search term to filter job postings by title, company name, or description.
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *           enum: [Semua, Full-time, Part-time, Contract, Freelance, Internship]
 *           default: Semua
 *         description: Filter job postings by job type.
 *       - in: query
 *         name: workplaceType
 *         schema:
 *           type: string
 *           enum: [Semua, On-site, Remote, Hybrid]
 *           default: Semua
 *         description: Filter job postings by workplace type.
 *     responses:
 *       200:
 *         description: A paginated list of job postings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       slug:
 *                         type: object
 *                         properties:
 *                           current:
 *                             type: string
 *                       publishedAt:
 *                         type: string
 *                         format: date-time
 *                       company:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           logo:
 *                             type: object
 *                             properties:
 *                               asset:
 *                                 type: object
 *                                 properties:
 *                                   _ref:
 *                                     type: string
 *                       jobType:
 *                         type: string
 *                       workplaceType:
 *                         type: string
 *                       expiresAt:
 *                         type: string
 *                         format: date-time
 *                       postedAt:
 *                         type: string
 *                         description: Human-readable time since the job was posted.
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
  const jobType = searchParams.get('jobType') || 'Semua';
  const workplaceType = searchParams.get('workplaceType') || 'Semua';

  try {
    // Buat filter conditions
    let filterConditions = [];
    
    // Filter berdasarkan jenis pekerjaan
    if (jobType && jobType !== 'Semua') {
      // Konversi format filter ke format yang sesuai dengan skema Sanity
      let sanityJobType = '';
      switch(jobType) {
        case 'Full-time':
          sanityJobType = 'fullTime';
          break;
        case 'Part-time':
          sanityJobType = 'partTime';
          break;
        case 'Contract':
          sanityJobType = 'contract';
          break;
        case 'Freelance':
          sanityJobType = 'freelance';
          break;
        case 'Internship':
          sanityJobType = 'internship';
          break;
        default:
          sanityJobType = jobType;
      }
      filterConditions.push(`jobType == "${sanityJobType}"`);
    }
    
    // Filter berdasarkan tipe tempat kerja
    if (workplaceType && workplaceType !== 'Semua') {
      // Konversi format filter ke format yang sesuai dengan skema Sanity
      let sanityWorkplaceType = '';
      switch(workplaceType) {
        case 'On-site':
          sanityWorkplaceType = 'onsite';
          break;
        case 'Remote':
          sanityWorkplaceType = 'remote';
          break;
        case 'Hybrid':
          sanityWorkplaceType = 'hybrid';
          break;
        default:
          sanityWorkplaceType = workplaceType;
      }
      filterConditions.push(`workplaceType == "${sanityWorkplaceType}"`);
    }
    
    // Filter berdasarkan pencarian
    if (searchTerm && searchTerm.trim() !== '') {
      filterConditions.push(
        `(title match "*${searchTerm}*" || 
          company.name match "*${searchTerm}*" || 
          coalesce(description, "") match "*${searchTerm}*")`
      );
    }
    
    // Membuat filter query
    const filterQuery = filterConditions.length > 0 
      ? ` && ${filterConditions.join(' && ')}` 
      : '';
    
    // Buat query untuk menghitung total
    const countQuery = `count(*[
      _type == "jobPosting"
      && defined(slug.current)
      ${filterQuery}
    ])`;
    
    // Buat query untuk mengambil data dengan pagination
    const jobsQuery = `*[
      _type == "jobPosting"
      && defined(slug.current)
      ${filterQuery}
    ]|order(publishedAt desc)[${(page - 1) * limit}...${page * limit}]{
      _id, 
      title, 
      slug,
      publishedAt,
      company,
      jobType,
      workplaceType,
      expiresAt
    }`;
    
    // Ambil data dan total items
    const [jobs, totalItems] = await Promise.all([
      client.fetch(jobsQuery),
      client.fetch(countQuery)
    ]);
    
    // Format tanggal untuk publishedAt dan expiresAt
    const formattedJobs = jobs.map((job: any) => {
      // Hitung berapa lama sejak lowongan dipublikasikan
      const publishedDate = new Date(job.publishedAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - publishedDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let postedAt = '';
      if (diffDays === 0) {
        postedAt = 'Hari ini';
      } else if (diffDays === 1) {
        postedAt = 'Kemarin';
      } else if (diffDays < 7) {
        postedAt = `${diffDays} hari yang lalu`;
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        postedAt = `${weeks} minggu yang lalu`;
      } else {
        const months = Math.floor(diffDays / 30);
        postedAt = `${months} bulan yang lalu`;
      }
      
      return {
        ...job,
        postedAt
      };
    });
    
    // Hitung total halaman
    const totalPages = Math.ceil(totalItems / limit);
    
    return NextResponse.json({ 
      jobs: formattedJobs, 
      totalItems, 
      totalPages,
      currentPage: page,
      itemsPerPage: limit
    });
  } catch (error) {
    console.error('Error mengambil data lowongan kerja:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data lowongan kerja' },
      { status: 500 }
    );
  }
}
