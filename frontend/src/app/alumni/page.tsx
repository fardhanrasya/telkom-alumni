import { Metadata } from "next";
import { Suspense } from "react";
import AlumniContent from "./AlumniContent";

export const metadata: Metadata = {
  title: "Alumni | Portal Alumni SMK Telkom Jakarta",
  description:
    "Direktori alumni SMK Telkom Jakarta. Temukan dan terhubung dengan sesama alumni dari berbagai angkatan dan jurusan.",
  openGraph: {
    title: "Alumni | Portal Alumni SMK Telkom Jakarta",
    description:
      "Direktori alumni SMK Telkom Jakarta. Temukan dan terhubung dengan sesama alumni dari berbagai angkatan dan jurusan.",
    type: "website",
    images: [
      {
        url: "/alumni-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Alumni SMK Telkom Jakarta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alumni SMK Telkom Jakarta",
    description:
      "Direktori alumni SMK Telkom Jakarta. Temukan dan terhubung dengan sesama alumni.",
    images: ["/alumni-hero.jpg"],
  },
  alternates: {
    canonical: "/alumni",
  },
};

export default function AlumniPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-20 text-center">
          Memuat data alumni...
        </div>
      }
    >
      <AlumniContent />
    </Suspense>
  );
}
