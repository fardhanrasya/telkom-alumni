import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';
import { getAllEventsQuery } from '@/sanity/queries/eventQueries';

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
