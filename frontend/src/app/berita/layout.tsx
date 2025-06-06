import { ReactNode } from "react";
import { Metadata } from "next";
import { getSectionMetadata } from "@/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getSectionMetadata("berita");
  return {
    title: meta?.title || "Berita | Portal Alumni SMK Telkom Jakarta",
    description:
      meta?.description ||
      "Berita terbaru seputar kegiatan, prestasi, dan informasi terkini dari SMK Telkom Jakarta dan para alumninya.",
    openGraph: {
      title: meta?.ogTitle || meta?.title,
      description: meta?.ogDescription || meta?.description,
      type: "website",
      images: [
        {
          url: meta?.ogImage || "/berita-hero.jpg",
          width: 1200,
          height: 630,
          alt: meta?.ogImageAlt || "Berita SMK Telkom Jakarta",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta?.twitterTitle || meta?.title,
      description: meta?.twitterDescription || meta?.description,
      images: [meta?.twitterImage || "/berita-hero.jpg"],
    },
    keywords: meta?.keywords || [],
  };
}

export default function BeritaLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
