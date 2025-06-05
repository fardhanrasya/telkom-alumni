import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Berita | Portal Alumni SMK Telkom Jakarta",
  description:
    "Berita terbaru seputar kegiatan, prestasi, dan informasi terkini dari SMK Telkom Jakarta dan para alumninya.",
  openGraph: {
    title: "Berita | Portal Alumni SMK Telkom Jakarta",
    description:
      "Berita terbaru seputar kegiatan, prestasi, dan informasi terkini dari SMK Telkom Jakarta dan para alumninya.",
    type: "website",
    images: [
      {
        url: "/berita-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Berita SMK Telkom Jakarta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Berita | Portal Alumni SMK Telkom Jakarta",
    description:
      "Berita terbaru seputar kegiatan, prestasi, dan informasi terkini dari SMK Telkom Jakarta dan para alumninya.",
    images: ["/berita-hero.jpg"],
  },
};

export default function BeritaLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
