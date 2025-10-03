import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/client';
import { getAllNewsTagsQuery } from '@/sanity/queries/newsQueries';

/**
 * @swagger
 * /api/berita/tags:
 *   get:
 *     summary: Get all news tags.
 *     description: Retrieve a list of all available news tags.
 *     responses:
 *       200:
 *         description: A list of news tags.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tags:
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
export async function GET(request: NextRequest) {
  try {
    // Mengambil semua tag berita
    const tags = await client.fetch(getAllNewsTagsQuery);
    
    // Mengembalikan respons
    return NextResponse.json({
      tags,
      success: true
    });
  } catch (error) {
    console.error('Error fetching news tags:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data tag berita' },
      { status: 500 }
    );
  }
}
