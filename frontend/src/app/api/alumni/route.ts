import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

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
