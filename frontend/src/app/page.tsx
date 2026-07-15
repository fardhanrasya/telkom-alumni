import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";

import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import UpcomingEvents from "@/components/UpcomingEvents";
import FeaturedAlumni from "@/components/FeaturedAlumni";
import JobsSection from "@/components/JobsSection";
import CTASection from "@/components/CTASection";
import NewsSection from "@/components/NewsSection";

// Import query yang sudah dimodularisasi
import {
  getUpcomingEventsQuery,
  getFeaturedAlumniQuery,
  getRecentJobsQuery
} from "@/sanity/queries";

// Import query berita dari newsQueries
import { getRecentNewsQuery } from "@/sanity/queries/newsQueries";

// Opsi untuk revalidasi data dari Sanity

const options = { next: { revalidate: 30 } };

// Format tanggal untuk tampilan yang lebih baik
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export default async function IndexPage() {
  // Mengambil data dari Sanity menggunakan query modular
  const posts = await client.fetch<SanityDocument[]>(getRecentNewsQuery(3), {}, options);
  const events = await client.fetch<SanityDocument[]>(getUpcomingEventsQuery(3), {}, options);
  const alumni = await client.fetch<SanityDocument[]>(getFeaturedAlumniQuery(4), {}, options);
  // Mengambil lowongan dari API Backend eksternal
  let jobs: any[] = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fardhanserver.tail824e9e.ts.net';
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || '73a44133b499434ce8c239962fccdc2211dba0a63575dd758e39026cfde0d5ab';
    const res = await fetch(`${apiUrl}/jobs/search?per_page=3`, {
      headers: {
        'X-API-Key': apiKey,
        'Accept': 'application/json',
      },
      next: { revalidate: 30 }
    });
    if (res.ok) {
      const data = await res.json();
      jobs = (data.hits || []).map((hit: any) => ({
        _id: hit.id,
        title: hit.title,
        company: hit.company,
        location: hit.location || '',
        slug: { current: hit.id },
        jobType: hit.job_type,
        publishedAt: hit.posted_at ? new Date(hit.posted_at * 1000).toISOString() : new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.error('Error fetching recent jobs from API:', err);
  }

  return (
    <>
      <HeroSection />
      <StatsSection />
      
      {/* Berita Terbaru */}
      <NewsSection posts={posts} />
      
      <UpcomingEvents events={events} />
      <FeaturedAlumni alumni={alumni} />
      <CTASection />
      <JobsSection jobs={jobs} />
    </>
  );
}