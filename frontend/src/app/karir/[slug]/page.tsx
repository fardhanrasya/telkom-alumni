import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { getJobBySlugQuery } from "@/sanity/queries/jobQueries";
import { PortableText } from "@portabletext/react";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { urlFor } from "@/sanity/utils";

interface JobDetail {
  _id: string;
  title: string;
  slug: { current: string };
  company: string | { name: string; logo?: any };
  publishedAt: string;
  expiresAt?: string;
  jobType: string;
  workplaceType: string;
  salaryRange?:
    | string
    | { min?: number; max?: number; currency?: string; isPublic?: boolean };
  description: any;
  requirements?: any;
  responsibilities?: any;
  applyLink?: string;
  contactEmail?: string;
  postedBy?: {
    _id: string;
    name: string;
    profileImageUrl?: string;
  };
}

// Definisikan tipe params sesuai dengan yang diharapkan Next.js
interface Props {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJobDetail(params.slug);

  if (!job) {
    return {
      title: "Lowongan Tidak Ditemukan | Portal Alumni SMK Telkom Jakarta",
      description: "Lowongan kerja yang Anda cari tidak ditemukan.",
    };
  }

  const companyName =
    typeof job.company === "string" ? job.company : job.company.name;
  const description = `Lowongan ${job.title} di ${companyName} - ${job.jobType} ${job.workplaceType}. ${job.description ? `Deskripsi: ${job.description}` : ""}`;
  const companyLogo =
    (typeof job.company !== "string" &&
      job.company?.logo &&
      urlFor(job.company.logo)?.url()) ||
    "/karir-hero.jpg";

  return {
    title: `${job.title} - ${companyName} | Portal Alumni SMK Telkom Jakarta`,
    description: description,
    openGraph: {
      title: `${job.title} - ${companyName} | Portal Alumni SMK Telkom Jakarta`,
      description: description,
      type: "article",
      images: [
        {
          url: companyLogo,
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
      images: [companyLogo],
    },
    alternates: {
      canonical: `/karir/${params.slug}`,
    },
  };
}

async function getJobDetail(slug: string): Promise<JobDetail | null> {
  try {
    return await client.fetch(getJobBySlugQuery, { slug });
  } catch (error) {
    console.error("Error fetching job detail:", error);
    return null;
  }
}

export default async function JobDetailPage({ params }: Props) {
  const job = await getJobDetail(params.slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <a
            href="/karir"
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark"
          >
            <svg
              className="mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Kembali ke Daftar Lowongan
          </a>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                  {typeof job.company !== "string" && job.company.logo ? (
                    <Image
                      src={urlFor(job.company.logo)?.url() || ""}
                      alt={
                        typeof job.company === "string"
                          ? job.company
                          : job.company.name
                      }
                      className="object-contain"
                      fill
                    />
                  ) : (
                    <span className="text-2xl font-bold text-primary">
                      {typeof job.company === "string"
                        ? job.company.charAt(0)
                        : job.company.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {job.title}
                  </h1>
                  <p className="mt-1 text-lg text-gray-600">
                    {typeof job.company === "string"
                      ? job.company
                      : job.company.name}
                  </p>
                </div>
              </div>

              {job.applyLink && (
                <div className="mt-4 md:mt-0">
                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="lg">Lamar Sekarang</Button>
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="col-span-2">
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900">
                    Deskripsi Pekerjaan
                  </h2>
                  <div className="mt-4 prose prose-blue max-w-none text-gray-900">
                    <PortableText value={job.description} />
                  </div>
                </div>

                {job.responsibilities && (
                  <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-900">
                      Tanggung Jawab
                    </h2>
                    <div className="mt-4 prose prose-blue max-w-none text-gray-900">
                      <PortableText value={job.responsibilities} />
                    </div>
                  </div>
                )}

                {job.requirements && (
                  <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-900">
                      Persyaratan
                    </h2>
                    <div className="mt-4 prose prose-blue max-w-none text-gray-900">
                      <PortableText value={job.requirements} />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="rounded-lg bg-gray-50 p-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    Informasi Lowongan
                  </h2>
                  <dl className="mt-4 space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Jenis Pekerjaan
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {job.jobType}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Lokasi Kerja
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {job.workplaceType}
                      </dd>
                    </div>

                    {job.salaryRange &&
                      typeof job.salaryRange !== "string" &&
                      (job.salaryRange.isPublic === true ||
                        job.salaryRange.isPublic === undefined) && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Kisaran Gaji
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {typeof job.salaryRange === "string"
                              ? job.salaryRange
                              : job.salaryRange.min && job.salaryRange.max
                                ? `${job.salaryRange.currency || "IDR"} ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}`
                                : job.salaryRange.min
                                  ? `${job.salaryRange.currency || "IDR"} ${job.salaryRange.min.toLocaleString()}+`
                                  : job.salaryRange.max
                                    ? `Hingga ${job.salaryRange.currency || "IDR"} ${job.salaryRange.max.toLocaleString()}`
                                    : "Negosiasi"}
                          </dd>
                        </div>
                      )}

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Tanggal Publikasi
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDate(job.publishedAt)}
                      </dd>
                    </div>

                    {job.expiresAt && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Batas Akhir Lamaran
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {formatDate(job.expiresAt)}
                        </dd>
                      </div>
                    )}

                    {job.contactEmail && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Email Kontak
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <a
                            href={`mailto:${job.contactEmail}`}
                            className="text-primary hover:text-primary-dark"
                          >
                            {job.contactEmail}
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>

                  {job.postedBy && (
                    <div className="mt-6 border-t border-gray-200 pt-6">
                      <h3 className="text-sm font-medium text-gray-500">
                        Diposting oleh
                      </h3>
                      <div className="mt-3 flex items-center">
                        <div className="flex-shrink-0">
                          {job.postedBy.profileImageUrl ? (
                            <div className="relative h-10 w-10 overflow-hidden rounded-full">
                              <Image
                                src={job.postedBy.profileImageUrl}
                                alt={job.postedBy.name}
                                className="object-cover"
                                fill
                              />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                              <span className="text-sm font-medium text-gray-500">
                                {typeof job.postedBy.name === "string"
                                  ? job.postedBy.name.charAt(0)
                                  : "U"}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {job.postedBy.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
