import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fardhanserver.tail824e9e.ts.net';
    const apiKey = process.env.KARIR_API_KEY || process.env.NEXT_PUBLIC_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key is not configured on the server.' },
        { status: 500 }
      );
    }

    let response;
    let page = 1;
    let per_page = 8;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const extFormData = new FormData();
      
      const file = formData.get('file');
      if (file) {
        extFormData.append('file', file);
      }
      
      const location = formData.get('location');
      if (location) {
        extFormData.append('location', location);
      }
      
      const pageVal = formData.get('page');
      if (pageVal) {
        page = parseInt(pageVal.toString()) || 1;
        extFormData.append('page', pageVal);
      }
      
      const perPageVal = formData.get('per_page');
      if (perPageVal) {
        per_page = parseInt(perPageVal.toString()) || 8;
        extFormData.append('per_page', perPageVal);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 seconds for large files

      response = await fetch(`${apiUrl}/jobs/search/by-resume`, {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
          'Accept': 'application/json',
        },
        body: extFormData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } else {
      const body = await request.json();
      const { text, location, page: bodyPage = 1, per_page: bodyPerPage = 8 } = body;
      page = bodyPage;
      per_page = bodyPerPage;

      if (!text || text.trim().length < 20) {
        return NextResponse.json(
          { error: 'Teks resume minimal harus 20 karakter.' },
          { status: 400 }
        );
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      response = await fetch(`${apiUrl}/jobs/search/by-resume`, {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          text,
          location: location || undefined,
          page,
          per_page,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errBody = await response.json().catch(() => null);
      return NextResponse.json(
        { error: errBody?.message || errBody?.error || `Gagal memproses resume (status ${response.status}).` },
        { status: response.status >= 500 ? 502 : response.status }
      );
    }

    const data = await response.json();

    // Map hits to UI format
    const jobs = (data.hits || []).map((hit: any, index: number) => {
      let postedAt = 'Baru saja';
      if (hit.posted_at) {
        const postedDate = new Date(hit.posted_at * 1000);
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

      // Calculate a clean matching score percentage (0-100)
      let score = 85; // default fallback
      if (hit.vector_distance !== undefined && hit.vector_distance !== null) {
        // cosine distance similarity calculation (1 - distance)
        score = Math.round((1 - hit.vector_distance) * 100);
        if (score < 50) score = 50 + Math.round((1 - hit.vector_distance) * 30);
        if (score > 100) score = 98;
      } else if (hit.text_match !== undefined && hit.text_match !== null) {
        // If it's already a standard percentage
        if (hit.text_match > 0 && hit.text_match <= 100) {
          score = Math.round(hit.text_match);
        } else {
          // If it's a raw relevance score, map to clean rank-based percentage
          score = Math.max(70, 96 - index * 4 - (Math.abs(hit.text_match) % 3));
        }
      } else {
        score = Math.max(70, 95 - index * 5);
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
        score,
      };
    });

    return NextResponse.json({
      jobs,
      totalItems: data.found || jobs.length,
      totalPages: data.totalPages || 1,
      currentPage: data.page || page,
      itemsPerPage: data.per_page || per_page
    });
  } catch (error) {
    console.error('Error in resume matching local API:', error);
    return NextResponse.json(
      { error: 'Gagal mencocokkan resume dengan lowongan. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
