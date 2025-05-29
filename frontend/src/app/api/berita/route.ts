import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Mengambil parameter dari URL
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';
    const year = searchParams.get('year') || '';
    
    // Menghitung offset untuk pagination
    const offset = (page - 1) * limit;
    
    // Membangun query filter
    let filterConditions = [`_type == "NewsPost"`];
    
    if (search) {
      filterConditions.push(`(title match "*${search}*" || excerpt match "*${search}*")`);
    }
    
    if (tag) {
      filterConditions.push(`count((tags[]->slug.current)[@ == "${tag}"]) > 0`);
    }
    
    if (year) {
      const startYear = new Date(`${year}-01-01T00:00:00Z`).toISOString();
      const endYear = new Date(`${parseInt(year) + 1}-01-01T00:00:00Z`).toISOString();
      filterConditions.push(`(publishedAt >= "${startYear}" && publishedAt < "${endYear}")`);
    }
    
    // Menggabungkan filter menjadi satu string query
    const filterQuery = filterConditions.join(' && ');
    
    // Query untuk menghitung total item
    const countQuery = groq`count(*[${filterQuery}])`;
    
    // Query untuk mengambil data dengan pagination
    const dataQuery = groq`*[${filterQuery}] | order(publishedAt desc) [${offset}...${offset + limit}] {
      _id,
      title,
      subtitle,
      slug,
      publishedAt,
      updatedAt,
      excerpt,
      featured,
      status,
      "mainImageUrl": mainImage.asset->url,
      "authorName": author->name,
      "authorImage": author->image.asset->url,
      "tags": tags[]->name
    }`;
    
    // Menjalankan query secara paralel
    const [totalItems, news] = await Promise.all([
      client.fetch(countQuery),
      client.fetch(dataQuery)
    ]);
    
    // Menghitung total halaman
    const totalPages = Math.ceil(totalItems / limit);
    
    // Mengembalikan respons
    return NextResponse.json({
      news,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data berita' },
      { status: 500 }
    );
  }
}
