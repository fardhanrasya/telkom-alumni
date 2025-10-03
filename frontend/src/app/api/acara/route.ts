import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';
import { getAllEventsQuery } from '@/sanity/queries/eventQueries';

/**
 * @swagger
 * /api/acara:
 *   get:
 *     summary: Get a list of events with pagination and filters.
 *     description: Retrieve a paginated list of events, with optional filtering by search term and event type (online/offline).
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
 *           default: 6
 *         description: The number of items per page.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter events by title, description, or location.
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all, online, offline]
 *           default: all
 *         description: Filter events by type (online or offline). Use 'all' for all event types.
 *     responses:
 *       200:
 *         description: A paginated list of events.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
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
 *                       startDate:
 *                         type: string
 *                         format: date-time
 *                       endDate:
 *                         type: string
 *                         format: date-time
 *                       location:
 *                         type: string
 *                       isVirtual:
 *                         type: boolean
 *                       virtualLink:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                       description:
 *                         type: string
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
  const limit = parseInt(searchParams.get('limit') || '6');
  const searchTerm = searchParams.get('search') || '';
  const type = searchParams.get('type') || 'all'; // 'all', 'online', 'offline'
  
  try {
    // Buat filter conditions
    let filterConditions = [];
    
    // Filter berdasarkan tipe acara (online/offline)
    if (type && type !== 'all') {
      if (type === 'online') {
        filterConditions.push(`isVirtual == true`);
      } else if (type === 'offline') {
        filterConditions.push(`isVirtual == false`);
      }
    }
    
    // Filter berdasarkan pencarian
    if (searchTerm && searchTerm.trim() !== '') {
      filterConditions.push(
        `(title match "*${searchTerm}*" || 
          coalesce(description, "") match "*${searchTerm}*" || 
          coalesce(location, "") match "*${searchTerm}*")`
      );
    }
    
    // Membuat filter query
    const filterQuery = filterConditions.length > 0 
      ? ` && ${filterConditions.join(' && ')}` 
      : '';
    
    // Buat query untuk menghitung total
    const countQuery = `count(*[
      _type == "event"
      && defined(slug.current)
      ${filterQuery}
    ])`;
    
    // Buat query untuk mengambil data dengan pagination
    const eventsQuery = `*[
      _type == "event"
      && defined(slug.current)
      ${filterQuery}
    ]|order(startDate desc)[${(page - 1) * limit}...${page * limit}]{
      _id, 
      title, 
      slug,
      startDate,
      endDate,
      location,
      isVirtual,
      virtualLink,
      "imageUrl": image.asset->url,
      description
    }`;
    
    // Ambil data dan total items
    const [events, totalItems] = await Promise.all([
      client.fetch(eventsQuery),
      client.fetch(countQuery)
    ]);
    
    // Hitung total halaman
    const totalPages = Math.ceil(totalItems / limit);
    
    return NextResponse.json({ 
      events, 
      totalItems, 
      totalPages,
      currentPage: page,
      itemsPerPage: limit
    });
  } catch (error) {
    console.error('Error mengambil data acara:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data acara' },
      { status: 500 }
    );
  }
}
