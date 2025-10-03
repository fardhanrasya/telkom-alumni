import { ReactNode } from "react";
import { Metadata } from "next";
import { getSectionMetadata } from "@/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getSectionMetadata("acara");
  return {
    title: meta?.title || "Acara & Kegiatan | Portal Alumni SMK Telkom Jakarta",
    description:
      meta?.description ||
      "Temukan berbagai acara menarik yang diselenggarakan oleh alumni dan SMK Telkom Jakarta. Networking, workshop, dan kegiatan pengembangan karir.",
    openGraph: {
      title:
        meta?.ogTitle ||
        meta?.title ||
        "Acara & Kegiatan | Portal Alumni SMK Telkom Jakarta",
      description:
        meta?.ogDescription ||
        meta?.description ||
        "Temukan berbagai acara menarik yang diselenggarakan oleh alumni dan SMK Telkom Jakarta.",
      type: "website",
      images: [
        {
          url: meta?.ogImage || "/acara-hero.jpg",
          width: 1200,
          height: 630,
          alt: meta?.ogImageAlt || "Acara Alumni SMK Telkom Jakarta",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        meta?.twitterTitle || meta?.title || "Acara Alumni SMK Telkom Jakarta",
      description:
        meta?.twitterDescription ||
        meta?.description ||
        "Temukan berbagai acara menarik yang diselenggarakan oleh alumni dan SMK Telkom Jakarta.",
      images: [meta?.twitterImage || "/acara-hero.jpg"],
    },
    keywords: meta?.keywords || [],
    alternates: {
      canonical: "/acara",
    },
  };
}

export const revalidate = 300;

interface AcaraLayoutProps {
  readonly children: React.ReactNode;
}

export default function AcaraLayout({ children }: AcaraLayoutProps) {
  return <>{children}</>;
}
