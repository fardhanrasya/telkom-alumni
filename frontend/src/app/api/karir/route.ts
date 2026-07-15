import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '8');
  const searchTerm = searchParams.get('search') || '';
  const jobType = searchParams.get('jobType') || 'Semua';
  const location = searchParams.get('location') || '';

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fardhanserver.tail824e9e.ts.net';
  const apiKey = process.env.KARIR_API_KEY || process.env.NEXT_PUBLIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API Key is not configured on the server.' },
      { status: 500 }
    );
  }

  try {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('per_page', limit.toString());

    let finalSearchTerm = searchTerm || '';
    if (jobType && jobType !== 'Semua') {
      const apiJobType = jobType.toLowerCase();
      if (apiJobType === 'freelance') {
        finalSearchTerm = finalSearchTerm ? `${finalSearchTerm} freelance` : 'freelance';
      } else {
        queryParams.append('job_type', apiJobType);
      }
    }

    if (finalSearchTerm && finalSearchTerm.trim() !== '') {
      queryParams.append('q', finalSearchTerm);
    }

    if (location && location.trim() !== '') {
      queryParams.append('location', location);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`${apiUrl}/jobs/search?${queryParams.toString()}`, {
      headers: {
        'X-API-Key': apiKey,
        'Accept': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.json().catch(() => null);
      return NextResponse.json(
        { error: errBody?.message || errBody?.error || `Gagal memproses request (status ${response.status}).` },
        { status: response.status >= 500 ? 502 : response.status }
      );
    }

    const data = await response.json();
    
    // Map hits to UI format
    const jobs = (data.hits || []).map((hit: any) => {
      // Calculate human-readable posted time
      let postedAt = 'Baru saja';
      if (hit.posted_at) {
        const postedDate = new Date(hit.posted_at * 1000); // Unix timestamp is in seconds
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - postedDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
          const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
          if (diffHours === 0) {
            postedAt = 'Baru saja';
          } else {
            postedAt = `${diffHours} jam yang lalu`;
          }
        } else if (diffDays === 1) {
          postedAt = 'Kemarin';
        } else if (diffDays < 7) {
          postedAt = `${diffDays} hari yang lalu`;
        } else if (diffDays < 30) {
          const weeks = Math.floor(diffDays / 7);
          postedAt = `${weeks} minggu yang lalu`;
        } else {
          const months = Math.floor(diffDays / 30);
          postedAt = `${months} bulan yang lalu`;
        }
      }

      return {
        id: hit.id,
        title: hit.title,
        company: hit.company || '',
        location: hit.location || '',
        salary_min: hit.salary_min,
        salary_max: hit.salary_max,
        education_level: hit.education_level || '',
        education_is_mandatory: hit.education_is_mandatory,
        min_experience_years: hit.min_experience_years,
        experience_is_mandatory: hit.experience_is_mandatory,
        fresh_graduate_friendly: hit.fresh_graduate_friendly,
        is_internship: hit.is_internship,
        job_type: hit.job_type,
        jobType: hit.job_type,
        slug: { current: hit.id },
        description_summary: hit.description_summary,
        raw_requirements: hit.raw_requirements,
        postedAt,
      };
    });

    const totalItems = data.found || 0;
    const totalPages = limit > 0 ? Math.ceil(totalItems / limit) : 1;

    return NextResponse.json({
      jobs,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit
    });
  } catch (error) {
    console.error('Error fetching jobs in local proxy API:', error);
    return NextResponse.json(
      { error: 'Gagal memuat lowongan kerja. Silakan coba beberapa saat lagi.' },
      { status: 500 }
    );
  }
}
