import { Metadata } from "next";
import { client } from "@/sanity/client";
import { getAlumniBySlugQuery } from "@/sanity/queries/alumniQueries";

// Types for generateMetadata params
type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

  // Create metadata
  return {
    title: `${alumni.name} - Alumni ${majorLabel} | Portal Alumni SMK Telkom Jakarta`,
    description: alumni.bio
      ? `${alumni.bio.substring(0, 155)}...`
      : `Profil ${alumni.name}, alumni ${majorLabel} SMK Telkom Jakarta angkatan ${alumni.yearGraduated}.`,
    openGraph: {
      title: `${alumni.name} - Alumni SMK Telkom Jakarta`,
      description: alumni.bio
        ? `${alumni.bio.substring(0, 155)}...`
        : `Profil ${alumni.name}, alumni ${majorLabel} SMK Telkom Jakarta angkatan ${alumni.yearGraduated}.`,
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
      description: alumni.bio
        ? `${alumni.bio.substring(0, 155)}...`
        : `Profil ${alumni.name}, alumni ${majorLabel} SMK Telkom Jakarta angkatan ${alumni.yearGraduated}.`,
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
