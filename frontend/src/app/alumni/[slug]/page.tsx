import React from "react";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Globe,
  MapPin,
  Award,
  Briefcase,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { client } from "@/sanity/client";
import { getAlumniBySlugQuery } from "@/sanity/queries/alumniQueries";
import { Metadata } from "next";
import AlumniDetailContent from "./AlumniDetailContent";

// Tipe data untuk detail alumni
interface SocialMedia {
  linkedin?: string;
  instagram?: string;
  twitter?: string;
}

interface Achievement {
  title: string;
  year: number;
  description?: string;
}

interface AlumniDetail {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  yearGraduated: number;
  major: string;
  profileImageUrl?: string;
  email?: string;
  socialMedia?: SocialMedia[];
  currentJob?: {
    title?: string;
    company?: string;
    location?: string;
    startYear?: number;
  };
  bio?: string;
  achievements?: Achievement[];
}

// Fungsi untuk mendapatkan label jurusan berdasarkan kode
function getMajorLabel(majorValue: string): string {
  switch (majorValue) {
    case "rpl":
      return "Rekayasa Perangkat Lunak";
    case "tkj":
      return "Teknik Komputer dan Jaringan";
    case "mm":
      return "Multimedia";
    case "tei":
      return "Teknik Elektronika Industri";
    default:
      return majorValue;
  }
}

// Komponen untuk menampilkan ikon sosial media
const SocialIcon: React.FC<{ platform: string }> = ({ platform }) => {
  switch (platform) {
    case "instagram":
      return <Instagram className="h-5 w-5" />;
    case "twitter":
      return <Twitter className="h-5 w-5" />;
    case "linkedin":
      return <Linkedin className="h-5 w-5" />;
    default:
      return <Globe className="h-5 w-5" />;
  }
};

// Fungsi untuk mendapatkan data alumni dari server-side
async function getAlumniData(slug: string) {
  try {
    // Menggunakan client Sanity untuk mendapatkan data alumni berdasarkan slug
    const data = await client.fetch(getAlumniBySlugQuery, {
      slug: slug,
    });
    return { data };
  } catch (err) {
    console.error("Error mengambil data alumni:", err);
    return { error: "Terjadi kesalahan saat mengambil data alumni" };
  }
}

// Definisikan tipe params sesuai dengan yang diharapkan Next.js
type AlumniDetailPageProps = {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

// Helper function to extract text from bio
function getBioText(bio: any): string {
  if (!bio) return "";
  if (typeof bio === "string") return bio;

  // Handle Portable Text blocks
  if (Array.isArray(bio)) {
    return bio
      .filter((block: any) => block._type === "block" && block.children)
      .map((block: any) =>
        block.children
          .filter((child: any) => child._type === "span")
          .map((child: any) => child.text)
          .join("")
      )
      .join(" ");
  }

  return "";
}

export async function generateMetadata({
  params,
}: AlumniDetailPageProps): Promise<Metadata> {
  // Fetch alumni data
  const alumni = await client.fetch(getAlumniBySlugQuery, {
    slug: params.slug,
  });

  if (!alumni) {
    return {
      title: "Alumni Tidak Ditemukan | Portal Alumni SMK Telkom Jakarta",
      description: "Halaman alumni yang Anda cari tidak ditemukan.",
    };
  }

  // Get major label
  const majorLabels: { [key: string]: string } = {
    rpl: "Rekayasa Perangkat Lunak",
    tkj: "Teknik Komputer dan Jaringan",
    mm: "Multimedia",
    tei: "Teknik Elektronika Industri",
  };

  const majorLabel = majorLabels[alumni.major] || alumni.major;

  // Get bio text and truncate it
  const bioText = getBioText(alumni.bio);
  const truncatedBio =
    bioText.length > 155 ? `${bioText.substring(0, 155)}...` : bioText;

  // Create metadata
  return {
    title: `${alumni.name} - Alumni ${majorLabel} | Portal Alumni SMK Telkom Jakarta`,
    description:
      truncatedBio ||
      `Profil ${alumni.name}, alumni ${majorLabel} SMK Telkom Jakarta angkatan ${alumni.yearGraduated}.`,
    openGraph: {
      title: `${alumni.name} - Alumni SMK Telkom Jakarta`,
      description:
        truncatedBio ||
        `Profil ${alumni.name}, alumni ${majorLabel} SMK Telkom Jakarta angkatan ${alumni.yearGraduated}.`,
      type: "profile",
      images: [
        {
          url: alumni.profileImageUrl || "/alumni-hero.jpg",
          width: 800,
          height: 600,
          alt: alumni.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${alumni.name} - Alumni SMK Telkom Jakarta`,
      description:
        truncatedBio ||
        `Profil ${alumni.name}, alumni ${majorLabel} SMK Telkom Jakarta angkatan ${alumni.yearGraduated}.`,
      images: [alumni.profileImageUrl || "/alumni-hero.jpg"],
    },
    alternates: {
      canonical: `/alumni/${params.slug}`,
    },
    // Add structured data for Person
    other: {
      schema: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: alumni.name,
        description: truncatedBio,
        alumniOf: {
          "@type": "EducationalOrganization",
          name: "SMK Telkom Jakarta",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Jakarta",
            addressRegion: "DKI Jakarta",
            addressCountry: "ID",
          },
        },
        hasOccupation: alumni.currentJob
          ? {
              "@type": "Occupation",
              name: alumni.currentJob.title,
              hasOccupationLocation: {
                "@type": "Organization",
                name: alumni.currentJob.company,
              },
            }
          : undefined,
        sameAs: [
          alumni.socialMedia?.linkedin,
          alumni.socialMedia?.twitter,
          alumni.socialMedia?.instagram,
        ].filter(Boolean),
      }),
    },
  };
}

export default async function AlumniDetailPage({
  params,
}: AlumniDetailPageProps) {
  const alumni = await client.fetch(getAlumniBySlugQuery, {
    slug: params.slug,
  });

  if (!alumni) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Alumni tidak ditemukan
        </h1>
        <p className="text-gray-600 mb-8">Silakan kembali ke halaman alumni</p>
      </div>
    );
  }

  return <AlumniDetailContent alumni={alumni} />;
}
