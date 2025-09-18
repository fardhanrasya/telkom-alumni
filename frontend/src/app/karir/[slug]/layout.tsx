import { ReactNode } from "react";
import { Metadata } from "next";
import { client } from "@/sanity/client";
import { getJobBySlugQuery } from "@/sanity/queries/jobQueries";

type Props = {
  params: Promise<{ slug: string }>;
  children: ReactNode;
};

const options = { next: { revalidate: 300 } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const job = await client.fetch(getJobBySlugQuery, { slug }, options);

    if (!job) {
      return {
        title: "Lowongan Tidak Ditemukan | Portal Alumni SMK Telkom Jakarta",
        description: "Lowongan kerja yang Anda cari tidak ditemukan.",
      };
    }

    const companyName =
      typeof job.company === "string"
        ? job.company
        : job.company?.name || "Perusahaan";
    const description = job.description
      ? typeof job.description === "string"
        ? job.description.substring(0, 155)
        : "Lowongan kerja terbaru dari komunitas alumni SMK Telkom Jakarta"
      : `Lowongan ${job.title} di ${companyName}. Bergabunglah dengan jaringan karir alumni SMK Telkom Jakarta.`;

    return {
      title: `${job.title} - ${companyName} | Portal Alumni SMK Telkom Jakarta`,
      description: description,
      openGraph: {
        title: `${job.title} - ${companyName} | Portal Alumni SMK Telkom Jakarta`,
        description: description,
        type: "article",
        images: [
          {
            url: "/karir-hero.jpg",
            width: 1200,
            height: 630,
            alt: `${job.title} - ${companyName}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${job.title} - ${companyName} | Portal Alumni SMK Telkom Jakarta`,
        description: description,
        images: ["/karir-hero.jpg"],
      },
      alternates: {
        canonical: `/karir/${slug}`,
      },
      // Add structured data for JobPosting
      other: {
        schema: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: job.title,
          description: description,
          hiringOrganization: {
            "@type": "Organization",
            name: companyName,
          },
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: job.workplaceType,
            },
          },
          employmentType: job.jobType?.toUpperCase(),
          datePosted: job.publishedAt,
          validThrough: job.expiresAt,
          baseSalary:
            job.salaryRange &&
            typeof job.salaryRange === "object" &&
            job.salaryRange.min
              ? {
                  "@type": "MonetaryAmount",
                  currency: job.salaryRange.currency || "IDR",
                  value: {
                    "@type": "QuantitativeValue",
                    minValue: job.salaryRange.min,
                    maxValue: job.salaryRange.max,
                  },
                }
              : undefined,
        }),
      },
    };
  } catch (error) {
    console.error("Error fetching job metadata:", error);
    return {
      title: "Karir | Portal Alumni SMK Telkom Jakarta",
      description: "Lowongan kerja dari komunitas alumni SMK Telkom Jakarta",
    };
  }
}

export const revalidate = 300;

export default function KarirSlugLayout({ children }: Props) {
  return <>{children}</>;
}
