import React from "react";

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
  params: Promise<{ slug: string }>;
  searchParams?: Record<string, string | string[] | undefined>;
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
  const resolvedParams = await params;
  const job = await getJobDetail(resolvedParams.slug);

  if (!job) {
    notFound();
  }

  const companyName =
    typeof job.company === "string" ? job.company : job.company.name;
  const companyLogo =
    typeof job.company !== "string" && job.company.logo
      ? urlFor(job.company.logo)?.url()
      : null;

  const salaryRangeText =
    job.salaryRange && typeof job.salaryRange !== "string"
      ? getSalaryRangeText(job.salaryRange)
      : (job.salaryRange as string);

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <JobHeader
            job={job}
            companyName={companyName}
            companyLogo={companyLogo}
          />

          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <JobContent
                description={job.description}
                responsibilities={job.responsibilities}
                requirements={job.requirements}
              />

              <JobSidebar
                job={job}
                salaryRangeText={salaryRangeText}
                companyName={companyName}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper components untuk modularitas
function BackButton() {
  return (
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
  );
}

function JobHeader({
  job,
  companyName,
  companyLogo,
}: {
  job: JobDetail;
  companyName: string;
  companyLogo: string | null;
}) {
  return (
    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <CompanyLogo companyName={companyName} logo={companyLogo} />
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="mt-1 text-lg text-gray-600">{companyName}</p>
          </div>
        </div>

        {job.applyLink && <ApplyButton applyLink={job.applyLink} />}
      </div>
    </div>
  );
}

function CompanyLogo({
  companyName,
  logo,
}: {
  companyName: string;
  logo: string | null;
}) {
  return (
    <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
      {logo ? (
        <Image src={logo} alt={companyName} className="object-contain" fill />
      ) : (
        <span className="text-2xl font-bold text-primary">
          {companyName.charAt(0)}
        </span>
      )}
    </div>
  );
}

function ApplyButton({ applyLink }: { applyLink: string }) {
  return (
    <div className="mt-4 md:mt-0">
      <a href={applyLink} target="_blank" rel="noopener noreferrer">
        <Button size="lg">Lamar Sekarang</Button>
      </a>
    </div>
  );
}

function JobContent({
  description,
  responsibilities,
  requirements,
}: {
  description: any;
  responsibilities?: any;
  requirements?: any;
}) {
  return (
    <div className="col-span-2 space-y-8">
      <ContentSection title="Deskripsi Pekerjaan" content={description} />
      {responsibilities && (
        <ContentSection title="Tanggung Jawab" content={responsibilities} />
      )}
      {requirements && (
        <ContentSection title="Persyaratan" content={requirements} />
      )}
    </div>
  );
}

function ContentSection({ title, content }: { title: string; content: any }) {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      <div className="mt-4 prose prose-blue max-w-none text-gray-900">
        <PortableText value={content} />
      </div>
    </div>
  );
}

function JobSidebar({
  job,
  salaryRangeText,
  companyName,
}: {
  job: JobDetail;
  salaryRangeText: string;
  companyName: string;
}) {
  return (
    <div>
      <div className="rounded-lg bg-gray-50 p-6">
        <h2 className="text-lg font-medium text-gray-900">
          Informasi Lowongan
        </h2>
        <JobInfoList job={job} salaryRangeText={salaryRangeText} />
        {job.postedBy && <PostedBySection postedBy={job.postedBy} />}
      </div>
    </div>
  );
}

function JobInfoList({
  job,
  salaryRangeText,
}: {
  job: JobDetail;
  salaryRangeText: string;
}) {
  const infoItems = [
    { label: "Jenis Pekerjaan", value: job.jobType },
    { label: "Lokasi Kerja", value: job.workplaceType },
    ...(salaryRangeText
      ? [{ label: "Kisaran Gaji", value: salaryRangeText }]
      : []),
    { label: "Tanggal Publikasi", value: formatDate(job.publishedAt) },
    ...(job.expiresAt
      ? [{ label: "Batas Akhir Lamaran", value: formatDate(job.expiresAt) }]
      : []),
    ...(job.contactEmail
      ? [
          {
            label: "Email Kontak",
            value: (
              <a
                href={`mailto:${job.contactEmail}`}
                className="text-primary hover:text-primary-dark"
              >
                {job.contactEmail}
              </a>
            ),
          },
        ]
      : []),
  ];

  return (
    <dl className="mt-4 space-y-4">
      {infoItems.map((item, index) => (
        <div key={index}>
          <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
          <dd className="mt-1 text-sm text-gray-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function PostedBySection({ postedBy }: { postedBy: JobDetail["postedBy"] }) {
  if (!postedBy) return null;

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h3 className="text-sm font-medium text-gray-500">Diposting oleh</h3>
      <div className="mt-3 flex items-center">
        <Avatar postedBy={postedBy} />
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{postedBy.name}</p>
        </div>
      </div>
    </div>
  );
}

function Avatar({ postedBy }: { postedBy: JobDetail["postedBy"] }) {
  if (!postedBy) return null;

  return (
    <div className="flex-shrink-0">
      {postedBy.profileImageUrl ? (
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={postedBy.profileImageUrl}
            alt={postedBy.name}
            className="object-cover"
            fill
          />
        </div>
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
          <span className="text-sm font-medium text-gray-500">
            {postedBy.name.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
}

// Helper function untuk salary range formatting
function getSalaryRangeText(
  salaryRange: Exclude<JobDetail["salaryRange"], string | undefined>
): string {
  if (!salaryRange) return "";

  if (salaryRange.min && salaryRange.max) {
    return `${
      salaryRange.currency || "IDR"
    } ${salaryRange.min.toLocaleString()} - ${salaryRange.max.toLocaleString()}`;
  } else if (salaryRange.min) {
    return `${
      salaryRange.currency || "IDR"
    } ${salaryRange.min.toLocaleString()}+`;
  } else if (salaryRange.max) {
    return `Hingga ${
      salaryRange.currency || "IDR"
    } ${salaryRange.max.toLocaleString()}`;
  }

  return "Negosiasi";
}
