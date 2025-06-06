import { ReactNode } from "react";
import { Metadata } from "next";
import { getSectionMetadata } from "@/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getSectionMetadata("acara");
  return {
    title: meta?.title || "Acara | Portal Alumni SMK Telkom Jakarta",
    description:
      meta?.description ||
      "Informasi acara, seminar, dan kegiatan terbaru dari SMK Telkom Jakarta dan alumni.",
    openGraph: {
      title: meta?.ogTitle || meta?.title,
      description: meta?.ogDescription || meta?.description,
      type: "website",
      images: [
        {
          url: meta?.ogImage || "/acara-hero.jpg",
          width: 1200,
          height: 630,
          alt: meta?.ogImageAlt || "Acara SMK Telkom Jakarta",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta?.twitterTitle || meta?.title,
      description: meta?.twitterDescription || meta?.description,
      images: [meta?.twitterImage || "/acara-hero.jpg"],
    },
    keywords: meta?.keywords || [],
  };
}

export default function AcaraLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
