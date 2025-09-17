import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Berita | Portal Alumni SMK Telkom Jakarta",
  description: "Berita terbaru dari komunitas alumni SMK Telkom Jakarta. Dapatkan informasi kegiatan, prestasi, dan perkembangan terkini.",
  openGraph: {
    title: "Berita | Portal Alumni SMK Telkom Jakarta",
    description: "Berita terbaru dari komunitas alumni SMK Telkom Jakarta. Dapatkan informasi kegiatan, prestasi, dan perkembangan terkini.",
    type: "website",
    images: [
      {
        url: "/berita-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Berita Alumni SMK Telkom Jakarta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Berita Alumni SMK Telkom Jakarta",
    description: "Berita terbaru dari komunitas alumni SMK Telkom Jakarta.",
    images: ["/berita-hero.jpg"],
  },
  alternates: {
    canonical: "/berita",
  },
};

interface BeritaLayoutProps {
  readonly children: React.ReactNode;
}

export default function BeritaLayout({ children }: BeritaLayoutProps) {
  return <>{children}</>;
}

