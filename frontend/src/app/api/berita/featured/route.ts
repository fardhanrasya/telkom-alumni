import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';
import { getFeaturedNewsQuery } from '@/sanity/queries/newsQueries';

/**
 * @swagger
 * /api/berita/featured:
 *   get:
 *     summary: Get featured news posts.
 *     description: Retrieve a list of featured news posts, typically limited to one.
 *     responses:
 *       200:
 *         description: A list of featured news posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 news:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       subtitle:
 *                         type: string
 *                       slug:
 *                         type: object
 *                         properties:
 *                           current:
 *                             type: string
 *                       publishedAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       excerpt:
 *                         type: string
 *                       featured:
 *                         type: boolean
 *                       status:
 *                         type: string
 *                       mainImageUrl:
 *                         type: string
 *                       authorName:
 *                         type: string
 *                       authorImage:
 *                         type: string
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                 success:
 *                   type: boolean
 *                   example: true
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
export async function GET() {
  try {
    // Mengambil berita unggulan dengan limit 1
    const news = await client.fetch(getFeaturedNewsQuery(1));
    
    // Mengembalikan respons
    return NextResponse.json({
      news,
      success: true
    });
  } catch (error) {
    console.error('Error fetching featured news:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data berita unggulan' },
      { status: 500 }
    );
  }
}
