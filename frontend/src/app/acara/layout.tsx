import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acara & Kegiatan | Portal Alumni SMK Telkom Jakarta",
  description: "Temukan berbagai acara menarik yang diselenggarakan oleh alumni dan SMK Telkom Jakarta. Ikuti networking, workshop, dan kegiatan lainnya.",
  openGraph: {
    title: "Acara & Kegiatan | Portal Alumni SMK Telkom Jakarta",
    description: "Temukan berbagai acara menarik yang diselenggarakan oleh alumni dan SMK Telkom Jakarta.",
    type: "website",
    images: [
      {
        url: "/acara-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Acara Alumni SMK Telkom Jakarta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Acara Alumni SMK Telkom Jakarta",
    description: "Temukan berbagai acara menarik yang diselenggarakan oleh alumni dan SMK Telkom Jakarta.",
    images: ["/acara-hero.jpg"],
  },
  alternates: {
    canonical: "/acara",
  },
};

export default function AcaraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}