import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';
import { getFeaturedNewsQuery } from '@/sanity/queries/newsQueries';

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
