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
  // Hanya tampilkan 3 alumni saja
  const featuredAlumni = alumni?.slice(0, 3) || [];
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

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
          {featuredAlumni.length > 0 ? (
            featuredAlumni.map((person) => (
              <Link
                key={person._id}
                href={`/alumni/${person.slug.current}`}
                className="group"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    {person.profileImageUrl ? (
                      <Image
                        src={person.profileImageUrl}
                        alt={person.name}
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Tidak ada foto</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Gradient Overlay - Lebih soft */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-75" />
                  
                  {/* Soft shadow untuk teks */}
                  <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Badge tahun lulus */}
                  <div className="absolute right-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-sm font-semibold text-white shadow-lg">
                    {person.yearGraduated}
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1 group-hover:text-primary-100 transition-colors duration-300">
                      {person.name}
                    </h3>
                    <p className="text-sm text-white/80 mb-2">
                      {majorMap[person.major] || person.major}
                    </p>
                    <div className="flex items-center space-x-1 text-sm">
                      <span className="font-medium text-white/90">
                        {person.currentJob?.title || 'Alumni'}
                      </span>
                      {person.currentJob?.company && (
                        <>
                          <span className="text-white/70">di</span>
                          <span className="font-medium text-primary-200">
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
