import { ReactNode } from "react";
import { Metadata } from "next";
import { getSectionMetadata } from "@/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getSectionMetadata("tentang");
  return {
    title: meta?.title || "Tentang | Portal Alumni SMK Telkom Jakarta",
    description:
      meta?.description ||
      "Informasi tentang SMK Telkom Jakarta, visi, misi, dan sejarah alumni.",
    openGraph: {
      title: meta?.ogTitle || meta?.title,
      description: meta?.ogDescription || meta?.description,
      type: "website",
      images: [
        {
          url: meta?.ogImage || "/tentang-hero.jpg",
          width: 1200,
          height: 630,
          alt: meta?.ogImageAlt || "Tentang SMK Telkom Jakarta",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta?.twitterTitle || meta?.title,
      description: meta?.twitterDescription || meta?.description,
      images: [meta?.twitterImage || "/tentang-hero.jpg"],
    },
    keywords: meta?.keywords || [],
  };
}

export default function TentangLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
