import { ReactNode } from "react";
import { Metadata } from "next";
import { getSectionMetadata } from "@/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getSectionMetadata("galeri");
  return {
    title: meta?.title || "Galeri | Portal Alumni SMK Telkom Jakarta",
    description:
      meta?.description ||
      "Kumpulan foto kegiatan, prestasi, dan fasilitas SMK Telkom Jakarta. Dokumentasi memori berharga komunitas alumni.",
    openGraph: {
      title:
        meta?.ogTitle ||
        meta?.title ||
        "Galeri | Portal Alumni SMK Telkom Jakarta",
      description:
        meta?.ogDescription ||
        meta?.description ||
        "Kumpulan foto kegiatan, prestasi, dan fasilitas SMK Telkom Jakarta.",
      type: "website",
      images: [
        {
          url: meta?.ogImage || "/galeri-hero.jpg",
          width: 1200,
          height: 630,
          alt: meta?.ogImageAlt || "Galeri SMK Telkom Jakarta",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta?.twitterTitle || meta?.title || "Galeri SMK Telkom Jakarta",
      description:
        meta?.twitterDescription ||
        meta?.description ||
        "Kumpulan foto kegiatan, prestasi, dan fasilitas SMK Telkom Jakarta.",
      images: [meta?.twitterImage || "/galeri-hero.jpg"],
    },
    keywords: meta?.keywords || [],
    alternates: {
      canonical: "/galeri",
    },
  };
}

export const revalidate = 300;

interface GaleriLayoutProps {
  readonly children: React.ReactNode;
}

export default function GaleriLayout({ children }: GaleriLayoutProps) {
  return <>{children}</>;
}
