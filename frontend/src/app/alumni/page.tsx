'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

// Contoh data alumni untuk halaman direktori
const alumniData = [
  {
    id: '1',
    name: 'Budi Santoso',
    graduationYear: 2005,
    major: 'Rekayasa Perangkat Lunak',
    currentPosition: 'CTO',
    company: 'Tokopedia',
    image: '/alumni-1.jpg',
    slug: 'budi-santoso',
  },
  {
    id: '2',
    name: 'Dewi Anggraini',
    graduationYear: 2010,
    major: 'Multimedia',
    currentPosition: 'Lead Designer',
    company: 'Gojek',
    image: '/alumni-2.jpg',
    slug: 'dewi-anggraini',
  },
  {
    id: '3',
    name: 'Ahmad Rizal',
    graduationYear: 2008,
    major: 'Teknik Komputer dan Jaringan',
    currentPosition: 'VP of Engineering',
    company: 'Traveloka',
    image: '/alumni-3.jpg',
    slug: 'ahmad-rizal',
  },
  {
    id: '4',
    name: 'Siti Nurhaliza',
    graduationYear: 2012,
    major: 'Rekayasa Perangkat Lunak',
    currentPosition: 'Founder & CEO',
    company: 'EdTech Indonesia',
    image: '/alumni-4.jpg',
    slug: 'siti-nurhaliza',
  },
  {
    id: '5',
    name: 'Rudi Hermawan',
    graduationYear: 2007,
    major: 'Teknik Komputer dan Jaringan',
    currentPosition: 'Network Engineer',
    company: 'Telkom Indonesia',
    image: '/alumni-5.jpg',
    slug: 'rudi-hermawan',
  },
  {
    id: '6',
    name: 'Lina Kusuma',
    graduationYear: 2015,
    major: 'Multimedia',
    currentPosition: 'UI/UX Designer',
    company: 'Bukalapak',
    image: '/alumni-6.jpg',
    slug: 'lina-kusuma',
  },
  {
    id: '7',
    name: 'Hendra Gunawan',
    graduationYear: 2011,
    major: 'Rekayasa Perangkat Lunak',
    currentPosition: 'Senior Software Engineer',
    company: 'Google',
    image: '/alumni-7.jpg',
    slug: 'hendra-gunawan',
  },
  {
    id: '8',
    name: 'Anita Wijaya',
    graduationYear: 2009,
    major: 'Teknik Elektronika Industri',
    currentPosition: 'Hardware Engineer',
    company: 'Schneider Electric',
    image: '/alumni-8.jpg',
    slug: 'anita-wijaya',
  },
];

// Filter options
const majors = ['Semua', 'Rekayasa Perangkat Lunak', 'Teknik Komputer dan Jaringan', 'Multimedia', 'Teknik Elektronika Industri'];
const graduationYears = ['Semua', '2005-2009', '2010-2015', '2016-2020', '2021-Sekarang'];

const AlumniPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('Semua');
  const [selectedYear, setSelectedYear] = useState('Semua');

  // Filter alumni berdasarkan pencarian dan filter
  const filteredAlumni = alumniData.filter((alumni) => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         alumni.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMajor = selectedMajor === 'Semua' || alumni.major === selectedMajor;
    
    let matchesYear = true;
    if (selectedYear !== 'Semua') {
      const year = alumni.graduationYear;
      if (selectedYear === '2005-2009') {
        matchesYear = year >= 2005 && year <= 2009;
      } else if (selectedYear === '2010-2015') {
        matchesYear = year >= 2010 && year <= 2015;
      } else if (selectedYear === '2016-2020') {
        matchesYear = year >= 2016 && year <= 2020;
      } else if (selectedYear === '2021-Sekarang') {
        matchesYear = year >= 2021;
      }
    }
    
    return matchesSearch && matchesMajor && matchesYear;
  });

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Direktori Alumni</h1>
          <p className="mt-4 text-lg text-gray-600">
            Temukan dan terhubung dengan alumni SMK Telkom Jakarta dari berbagai angkatan
          </p>
        </div>

        {/* Filter dan Pencarian */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Cari Alumni
              </label>
              <input
                type="text"
                id="search"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Cari berdasarkan nama atau perusahaan"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="major" className="block text-sm font-medium text-gray-700">
                Jurusan
              </label>
              <select
                id="major"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
              >
                {majors.map((major) => (
                  <option key={major} value={major}>
                    {major}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Tahun Lulus
              </label>
              <select
                id="year"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {graduationYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Hasil Pencarian */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Menampilkan {filteredAlumni.length} alumni
          </p>
        </div>

        {/* Daftar Alumni */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredAlumni.map((alumni) => (
            <Link
              key={alumni.id}
              href={`/alumni/${alumni.slug}`}
              className="group"
            >
              <div className="overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={alumni.image}
                    alt={alumni.name}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    fill
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary">
                    {alumni.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Angkatan {alumni.graduationYear} • {alumni.major}
                  </p>
                  <div className="mt-3 flex items-center space-x-1">
                    <span className="font-medium text-gray-900">
                      {alumni.currentPosition}
                    </span>
                    <span className="text-gray-500">di</span>
                    <span className="font-medium text-primary">
                      {alumni.company}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button variant="outline" size="sm">
              Sebelumnya
            </Button>
            <Button variant="outline" size="sm">
              Berikutnya
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Menampilkan <span className="font-medium">1</span> sampai{' '}
                <span className="font-medium">{filteredAlumni.length}</span> dari{' '}
                <span className="font-medium">{alumniData.length}</span> alumni
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                >
                  <span className="sr-only">Sebelumnya</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-current="page"
                  className="relative z-10 inline-flex items-center border border-primary bg-primary-50 px-4 py-2 text-sm font-medium text-primary focus:z-20"
                >
                  1
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                >
                  2
                </a>
                <a
                  href="#"
                  className="relative hidden items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 md:inline-flex"
                >
                  3
                </a>
                <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                  ...
                </span>
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                >
                  <span className="sr-only">Berikutnya</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniPage;
