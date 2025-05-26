'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { type SanityDocument } from 'next-sanity';
import { urlFor } from '@/sanity/utils';

interface JobsSectionProps {
  jobs: SanityDocument[];
}

// Map kode tipe pekerjaan ke nama lengkap
const jobTypeMap: Record<string, string> = {
  fullTime: 'Full-time',
  partTime: 'Part-time',
  contract: 'Kontrak',
  freelance: 'Freelance',
  internship: 'Magang',
};

// Format tanggal publikasi relatif
function formatRelativeDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Hari ini';
  } else if (diffDays === 1) {
    return 'Kemarin';
  } else if (diffDays < 7) {
    return `${diffDays} hari yang lalu`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} minggu yang lalu`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} bulan yang lalu`;
  }
}

const JobsSection: React.FC<JobsSectionProps> = ({ jobs }) => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Lowongan Kerja Terbaru
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Temukan peluang karir terbaru yang dibagikan oleh sesama alumni dan perusahaan partner.
          </p>
        </div>

        <div className="space-y-4">
          {jobs && jobs.length > 0 ? (
            jobs.map((job) => (
              <Link
                key={job._id}
                href={`/karir/${job.slug.current}`}
                className="block"
              >
                <div className="group overflow-hidden rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
                  <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center">
                      <div className="relative h-12 w-12 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                        {job.company?.logo ? (
                          <Image
                            src={urlFor(job.company.logo)?.url() || ''}
                            alt={job.company.name}
                            className="object-contain"
                            fill
                          />
                        ) : (
                          <span className="text-xs text-gray-500 text-center">{job.company?.name?.charAt(0) || 'C'}</span>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary">
                          {job.title}
                        </h3>
                        <div className="mt-1 flex items-center">
                          <span className="text-sm font-medium text-gray-700">
                            {job.company?.name}
                          </span>
                          {job.company?.location && (
                            <>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-sm text-gray-600">
                                {job.company.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto">
                      <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary">
                        {jobTypeMap[job.jobType] || job.jobType}
                      </span>
                      <span className="text-sm text-gray-500">{formatRelativeDate(job.publishedAt)}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto sm:ml-0"
                      >
                        Lihat Detail
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-xl font-medium text-gray-900">Belum ada lowongan kerja</h3>
              <p className="mt-1 text-gray-500">Lowongan kerja akan ditampilkan di sini.</p>
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Button href="/karir" variant="default">
            Lihat Semua Lowongan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobsSection;
