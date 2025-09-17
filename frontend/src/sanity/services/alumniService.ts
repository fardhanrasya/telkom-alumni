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
    // Cek jika tidak ada filter yang aktif
    if (shouldUsePaginatedAlumni(filters)) {
      console.log('Tidak ada filter, menggunakan getPaginatedAlumni');
      return await getPaginatedAlumni(page, limit);
    }

    // Bangun kondisi filter
    const whereClause = buildWhereClause(filters);

    // Eksekusi query
    const result = await executeAlumniQuery(whereClause, page, limit);
    
    return {
      alumni: result.alumni,
      totalPages: Math.ceil(result.totalItems / limit),
      totalItems: result.totalItems
    };

  } catch (error) {
    console.error('Error fetching filtered alumni:', error);
    throw new Error('Gagal mengambil data alumni');
  }
}

// Helper function untuk mengecek apakah harus menggunakan paginated alumni tanpa filter
function shouldUsePaginatedAlumni(filters: { 
  searchTerm?: string; 
  major?: string; 
  yearRange?: string;
}): boolean {
  return (
    (!filters.searchTerm || filters.searchTerm === '') &&
    (!filters.major || filters.major === 'Semua') &&
    (!filters.yearRange || filters.yearRange === 'Semua')
  );
}

// Helper function untuk membangun klausa WHERE
function buildWhereClause(filters: { 
  searchTerm?: string; 
  major?: string; 
  yearRange?: string;
}): string {
  const filterConditions: string[] = [];
  
  // Tambahkan filter jurusan jika ada
  addMajorFilter(filterConditions, filters.major);
  
  // Tambahkan filter tahun kelulusan jika ada
  addYearRangeFilter(filterConditions, filters.yearRange);
  
  // Tambahkan filter pencarian jika ada
  addSearchFilter(filterConditions, filters.searchTerm);

  return filterConditions.length > 0 ? `&& ${filterConditions.join(' && ')}` : '';
}

// Helper function untuk filter jurusan
function addMajorFilter(conditions: string[], major?: string): void {
  if (major && major !== 'Semua') {
    conditions.push(`major == "${major}"`);
  }
}

// Helper function untuk filter rentang tahun
function addYearRangeFilter(conditions: string[], yearRange?: string): void {
  if (!yearRange || yearRange === 'Semua') return;

  const yearRanges: { [key: string]: { start: number; end: number } } = {
    '2005-2009': { start: 2005, end: 2009 },
    '2010-2015': { start: 2010, end: 2015 },
    '2016-2020': { start: 2016, end: 2020 },
    '2021-2024': { start: 2021, end: 2024 }
  };

  const range = yearRanges[yearRange];
  if (range) {
    conditions.push(`yearGraduated >= ${range.start} && yearGraduated <= ${range.end}`);
  }
}

// Helper function untuk filter pencarian
function addSearchFilter(conditions: string[], searchTerm?: string): void {
  if (searchTerm && searchTerm !== '') {
    conditions.push(
      `(name match "${searchTerm}*" || 
        major match "${searchTerm}*" || 
        currentPosition match "${searchTerm}*" || 
        skills[] match "${searchTerm}*")`
    );
  }
}

// Helper function untuk mengeksekusi query
async function executeAlumniQuery(whereClause: string, page: number, limit: number): Promise<{
  alumni: Alumni[];
  totalItems: number;
}> {
  const start = (page - 1) * limit;
  const end = start + limit;

  const query = `{
    "alumni": *[_type == "alumni" ${whereClause}] | order(yearGraduated desc) [${start}...${end}] {
      _id,
      name,
      slug,
      profileImage,
      major,
      yearGraduated,
      currentPosition,
      currentCompany,
      skills,
      linkedinUrl,
      githubUrl,
      portfolioUrl
    },
    "totalItems": count(*[_type == "alumni" ${whereClause}])
  }`;

  return await client.fetch(query);
}
