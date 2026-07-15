import { ReactNode } from "react";
import { Metadata } from "next";
import { getSectionMetadata } from "@/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getSectionMetadata("alumni");
  return {
    title: meta?.title || "Alumni | Portal Alumni SMK Telkom Jakarta",
    description:
      meta?.description ||
      "Temukan profil alumni, kisah sukses, dan jaringan alumni SMK Telkom Jakarta.",
    openGraph: {
      title: meta?.ogTitle || meta?.title,
      description: meta?.ogDescription || meta?.description,
      type: "website",
      images: [
        {
          url: meta?.ogImage || "/alumni-hero.jpg",
          width: 1200,
          height: 630,
          alt: meta?.ogImageAlt || "Alumni SMK Telkom Jakarta",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta?.twitterTitle || meta?.title,
      description: meta?.twitterDescription || meta?.description,
      images: [meta?.twitterImage || "/alumni-hero.jpg"],
    },
    keywords: meta?.keywords || [],
    alternates: {
      canonical: "/alumni",
    },
  };
}

export const revalidate = 300;

export default function AlumniLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
