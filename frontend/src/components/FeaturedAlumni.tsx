'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { type SanityDocument } from 'next-sanity';

interface FeaturedAlumniProps {
  alumni: SanityDocument[];
}

// Map kode jurusan ke nama lengkap
const majorMap: Record<string, string> = {
  rpl: 'Rekayasa Perangkat Lunak',
  tkj: 'Teknik Komputer dan Jaringan',
  mm: 'Multimedia',
  tei: 'Teknik Elektronika Industri',
};

const FeaturedAlumni: React.FC<FeaturedAlumniProps> = ({ alumni }) => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Alumni Terkemuka
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Keberhasilan alumni kami adalah bukti kualitas pendidikan dan pembentukan karakter di SMK Telkom Jakarta.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {alumni && alumni.length > 0 ? (
            alumni.map((person) => (
              <Link
                key={person._id}
                href={`/alumni/${person.slug.current}`}
                className="group"
              >
                <div className="overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
                  <div className="relative h-64 w-full overflow-hidden">
                    {person.profileImageUrl ? (
                      <Image
                        src={person.profileImageUrl}
                        alt={person.name}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        fill
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Tidak ada foto</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary">
                      {person.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Angkatan {person.yearGraduated} • {majorMap[person.major] || person.major}
                    </p>
                    <div className="mt-3 flex items-center space-x-1">
                      <span className="font-medium text-gray-900">
                        {person.currentJob?.title || 'Alumni'}
                      </span>
                      {person.currentJob?.company && (
                        <>
                          <span className="text-gray-500">di</span>
                          <span className="font-medium text-primary">
                            {person.currentJob.company}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-4 text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="mt-2 text-xl font-medium text-gray-900">Belum ada data alumni</h3>
              <p className="mt-1 text-gray-500">Data alumni akan ditampilkan di sini.</p>
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Button href="/alumni" variant="default">
            Lihat Semua Alumni
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedAlumni;
