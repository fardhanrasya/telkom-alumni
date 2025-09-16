import { client } from '../client';
import { getAllAlumniQuery, getFeaturedAlumniQuery } from '../queries/alumniQueries';
import { Alumni } from '@/components/AlumniCard';

/**
 * Mengambil semua data alumni dari Sanity
 */
export async function getAllAlumni(): Promise<Alumni[]> {
  try {
    const alumni = await client.fetch(getAllAlumniQuery);
    return alumni;
  } catch (error) {
    console.error('Error mengambil data alumni:', error);
    return [];
  }
}

/**
 * Mengambil data alumni dengan pagination
 * @param page Halaman yang diminta
 * @param limit Jumlah item per halaman
 */
export async function getPaginatedAlumni(page: number = 1, limit: number = 8): Promise<{
  alumni: Alumni[];
  totalPages: number;
  totalItems: number;
}> {
  try {
    // Dapatkan total item untuk pagination
    const countQuery = `count(*[_type == "alumni" && defined(slug.current)])`;
    const totalItems = await client.fetch(countQuery);
    const totalPages = Math.ceil(totalItems / limit);
    
    // Mengambil alumni untuk halaman tertentu dengan pagination
    const paginatedQuery = `*[
      _type == "alumni"
      && defined(slug.current)
    ]|order(yearGraduated desc)[${(page - 1) * limit}...${page * limit}]{
      _id, 
      name, 
      slug,
      yearGraduated,
      major,
      "profileImageUrl": profileImage.asset->url,
      currentJob
    }`;
    
    const alumni = await client.fetch(paginatedQuery);
    
    return {
      alumni,
      totalPages,
      totalItems
    };
  } catch (error) {
    console.error('Error mengambil data alumni dengan pagination:', error);
    return {
      alumni: [],
      totalPages: 0,
      totalItems: 0
    };
  }
}

/**
 * Mengambil data alumni berdasarkan filter
 * @param filters Filter yang diterapkan
 * @param page Halaman yang diminta
 * @param limit Jumlah item per halaman
 */
export async function getFilteredAlumni(
  filters: { 
    searchTerm?: string; 
    major?: string; 
    yearRange?: string;
  },
  page: number = 1,
  limit: number = 8
): Promise<{
  alumni: Alumni[];
  totalPages: number;
  totalItems: number;
}> {
  try {
    // Jika tidak ada filter yang diterapkan, gunakan getPaginatedAlumni
    if (
      (!filters.searchTerm || filters.searchTerm === '') &&
      (!filters.major || filters.major === 'Semua') &&
      (!filters.yearRange || filters.yearRange === 'Semua')
    ) {
      console.log('Tidak ada filter, menggunakan getPaginatedAlumni');
      return await getPaginatedAlumni(page, limit);
    }

    let filterConditions = [];
    
    // Filter berdasarkan jurusan
    if (filters.major && filters.major !== 'Semua') {
      filterConditions.push(`major == "${filters.major}"`);
    }
    
    // Filter berdasarkan rentang tahun
    if (filters.yearRange && filters.yearRange !== 'Semua') {
      if (filters.yearRange === '2005-2009') {
        filterConditions.push(`yearGraduated >= 2005 && yearGraduated <= 2009`);
      } else if (filters.yearRange === '2010-2015') {
        filterConditions.push(`yearGraduated >= 2010 && yearGraduated <= 2015`);
      } else if (filters.yearRange === '2016-2020') {
        filterConditions.push(`yearGraduated >= 2016 && yearGraduated <= 2020`);
      } else if (filters.yearRange === '2021-Sekarang') {
        filterConditions.push(`yearGraduated >= 2021`);
      }
    }
    
    // Filter berdasarkan pencarian
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      const searchTerm = filters.searchTerm.trim();
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
    
    // Query untuk menghitung total
    const countQuery = `count(*[
      _type == "alumni"
      && defined(slug.current)
      ${filterQuery}
    ])`;
    
    const totalItems = await client.fetch(countQuery);
    const totalPages = Math.ceil(totalItems / limit);
    
    // Query untuk mengambil data dengan filter dan pagination
    const filteredQuery = `*[
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
    
    const alumni = await client.fetch(filteredQuery);
    
    return {
      alumni,
      totalPages,
      totalItems
    };
  } catch (error) {
    console.error('Error mengambil data alumni dengan filter:', error);
    return {
      alumni: [],
      totalPages: 0,
      totalItems: 0
    };
  }
}
