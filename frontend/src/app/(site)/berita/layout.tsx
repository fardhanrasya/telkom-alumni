import { Metadata } from "next";
import { getSectionMetadata } from "@/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getSectionMetadata("berita");
  return {
    title: meta?.title || "Berita | Portal Alumni SMK Telkom Jakarta",
    description:
      meta?.description ||
      "Berita terbaru dari komunitas alumni SMK Telkom Jakarta. Dapatkan informasi kegiatan, prestasi, dan perkembangan terkini.",
    openGraph: {
      title: meta?.ogTitle || meta?.title,
      description: meta?.ogDescription || meta?.description,
      type: "website",
      images: [
        {
          url: meta?.ogImage || "/berita-hero.jpg",
          width: 1200,
          height: 630,
          alt: meta?.ogImageAlt || "Berita Alumni SMK Telkom Jakarta",
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
    alternates: {
      canonical: "/berita",
    },
  };
}

export const revalidate = 300;

interface BeritaLayoutProps {
  readonly children: React.ReactNode;
}

export default function BeritaLayout({ children }: BeritaLayoutProps) {
  return <>{children}</>;
}
