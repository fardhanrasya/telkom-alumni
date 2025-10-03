import { Metadata } from "next";
import { getSectionMetadata } from "@/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getSectionMetadata("karir");
  return {
    title: meta?.title || "Lowongan Kerja | Portal Alumni SMK Telkom Jakarta",
    description:
      meta?.description ||
      "Temukan peluang karir terbaru yang dibagikan oleh sesama alumni dan perusahaan partner. Dapatkan pekerjaan impian Anda di sini.",
    openGraph: {
      title: meta?.ogTitle || meta?.title,
      description: meta?.ogDescription || meta?.description,
      type: "website",
      images: [
        {
          url: meta?.ogImage || "/karir-hero.jpg",
          width: 1200,
          height: 630,
          alt: meta?.ogImageAlt || "Lowongan Kerja Alumni SMK Telkom Jakarta",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta?.twitterTitle || meta?.title,
      description: meta?.twitterDescription || meta?.description,
      images: [meta?.twitterImage || "/karir-hero.jpg"],
    },
    keywords: meta?.keywords || [],
    alternates: {
      canonical: "/karir",
    },
  };
}

export const revalidate = 300;

interface KarirLayoutProps {
  readonly children: React.ReactNode;
}

export default function KarirLayout({ children }: KarirLayoutProps) {
  return <>{children}</>;
}
