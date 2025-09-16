import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/client';
import { getAllNewsTagsQuery } from '@/sanity/queries/newsQueries';

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
