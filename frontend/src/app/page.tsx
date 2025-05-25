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
  getRecentPostsQuery,
  getUpcomingEventsQuery,
  getFeaturedAlumniQuery,
  getRecentJobsQuery
} from "@/sanity/queries";

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
  const posts = await client.fetch<SanityDocument[]>(getRecentPostsQuery(3), {}, options);
  const events = await client.fetch<SanityDocument[]>(getUpcomingEventsQuery(3), {}, options);
  const alumni = await client.fetch<SanityDocument[]>(getFeaturedAlumniQuery(4), {}, options);
  const jobs = await client.fetch<SanityDocument[]>(getRecentJobsQuery(3), {}, options);

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