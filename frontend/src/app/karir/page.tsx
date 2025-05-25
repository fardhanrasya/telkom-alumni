'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

// Contoh data lowongan kerja
const jobData = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Tokopedia',
    logo: '/company-1.png',
    location: 'Jakarta',
    type: 'Full-time',
    workplace: 'Hybrid',
    postedAt: '2 hari yang lalu',
    description: 'Tokopedia sedang mencari Senior Frontend Developer yang berpengalaman dalam React, TypeScript, dan state management untuk bergabung dengan tim engineering kami.',
    salaryRange: 'Rp20.000.000 - Rp30.000.000',
    slug: 'senior-frontend-developer-tokopedia',
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    company: 'Gojek',
    logo: '/company-2.png',
    location: 'Jakarta',
    type: 'Full-time',
    workplace: 'On-site',
    postedAt: '3 hari yang lalu',
    description: 'Bergabunglah dengan tim desain Gojek untuk menciptakan pengalaman pengguna yang luar biasa di seluruh produk Gojek yang digunakan oleh jutaan pengguna setiap hari.',
    salaryRange: 'Rp15.000.000 - Rp25.000.000',
    slug: 'ui-ux-designer-gojek',
  },
  {
    id: '3',
    title: 'Network Engineer',
    company: 'Telkom Indonesia',
    logo: '/company-3.png',
    location: 'Bandung',
    type: 'Full-time',
    workplace: 'On-site',
    postedAt: '1 minggu yang lalu',
    description: 'Telkom Indonesia mencari Network Engineer yang terampil untuk merancang, mengimplementasikan, dan mengelola infrastruktur jaringan perusahaan.',
    salaryRange: 'Rp12.000.000 - Rp18.000.000',
    slug: 'network-engineer-telkom-indonesia',
  },
  {
    id: '4',
    title: 'Product Manager',
    company: 'Bukalapak',
    logo: '/company-4.png',
    location: 'Jakarta',
    type: 'Full-time',
    workplace: 'Hybrid',
    postedAt: '5 hari yang lalu',
    description: 'Bukalapak mencari Product Manager yang berpengalaman untuk memimpin pengembangan fitur baru pada marketplace kami.',
    salaryRange: 'Rp25.000.000 - Rp35.000.000',
    slug: 'product-manager-bukalapak',
  },
  {
    id: '5',
    title: 'Backend Developer (Java)',
    company: 'Traveloka',
    logo: '/company-5.png',
    location: 'Jakarta',
    type: 'Full-time',
    workplace: 'Remote',
    postedAt: '1 minggu yang lalu',
    description: 'Traveloka mencari Backend Developer dengan keahlian Java dan Spring Boot untuk bergabung dengan tim kami yang dinamis.',
    salaryRange: 'Rp18.000.000 - Rp28.000.000',
    slug: 'backend-developer-java-traveloka',
  },
  {
    id: '6',
    title: 'Data Scientist',
    company: 'Shopee',
    logo: '/company-6.png',
    location: 'Jakarta',
    type: 'Full-time',
    workplace: 'Hybrid',
    postedAt: '2 minggu yang lalu',
    description: 'Bergabunglah dengan tim data science Shopee untuk menerapkan machine learning dan analisis statistik guna memecahkan masalah bisnis yang kompleks.',
    salaryRange: 'Rp20.000.000 - Rp30.000.000',
    slug: 'data-scientist-shopee',
  },
  {
    id: '7',
    title: 'DevOps Engineer',
    company: 'Blibli',
    logo: '/company-7.png',
    location: 'Jakarta',
    type: 'Full-time',
    workplace: 'On-site',
    postedAt: '3 hari yang lalu',
    description: 'Blibli mencari DevOps Engineer yang berpengalaman dengan AWS, Docker, dan Kubernetes untuk mendukung operasional platform e-commerce kami.',
    salaryRange: 'Rp18.000.000 - Rp28.000.000',
    slug: 'devops-engineer-blibli',
  },
  {
    id: '8',
    title: 'Mobile Developer (Android)',
    company: 'Dana',
    logo: '/company-8.png',
    location: 'Jakarta',
    type: 'Full-time',
    workplace: 'Hybrid',
    postedAt: '1 minggu yang lalu',
    description: 'Dana mencari Mobile Developer dengan keahlian di Android untuk mengembangkan dan meningkatkan aplikasi dompet digital kami.',
    salaryRange: 'Rp15.000.000 - Rp25.000.000',
    slug: 'mobile-developer-android-dana',
  },
];

// Filter options
const jobTypes = ['Semua', 'Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
const workplaceTypes = ['Semua', 'On-site', 'Remote', 'Hybrid'];

const KarirPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('Semua');
  const [selectedWorkplace, setSelectedWorkplace] = useState('Semua');

  // Filter lowongan berdasarkan pencarian dan filter
  const filteredJobs = jobData.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesJobType = selectedJobType === 'Semua' || job.type === selectedJobType;
    const matchesWorkplace = selectedWorkplace === 'Semua' || job.workplace === selectedWorkplace;
    
    return matchesSearch && matchesJobType && matchesWorkplace;
  });

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Lowongan Kerja</h1>
          <p className="mt-4 text-lg text-gray-600">
            Temukan peluang karir terbaru yang dibagikan oleh sesama alumni dan perusahaan partner
          </p>
        </div>

        {/* Filter dan Pencarian */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Cari Lowongan
              </label>
              <input
                type="text"
                id="search"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Cari berdasarkan judul, perusahaan, atau deskripsi"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
                Jenis Pekerjaan
              </label>
              <select
                id="jobType"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
              >
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="workplace" className="block text-sm font-medium text-gray-700">
                Tipe Tempat Kerja
              </label>
              <select
                id="workplace"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                value={selectedWorkplace}
                onChange={(e) => setSelectedWorkplace(e.target.value)}
              >
                {workplaceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Hasil Pencarian */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Menampilkan {filteredJobs.length} lowongan kerja
          </p>
        </div>

        {/* Daftar Lowongan */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Link
              key={job.id}
              href={`/karir/${job.slug}`}
              className="block"
            >
              <div className="group overflow-hidden rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center">
                    <div className="relative h-12 w-12 overflow-hidden rounded-md">
                      <Image
                        src={job.logo}
                        alt={job.company}
                        className="object-contain"
                        fill
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary">
                        {job.title}
                      </h3>
                      <div className="mt-1 flex items-center">
                        <span className="text-sm font-medium text-gray-700">
                          {job.company}
                        </span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          {job.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto">
                    <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary">
                      {job.type}
                    </span>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {job.workplace}
                    </span>
                    <span className="text-sm text-gray-500">{job.postedAt}</span>
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
                <span className="font-medium">{filteredJobs.length}</span> dari{' '}
                <span className="font-medium">{jobData.length}</span> lowongan
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

export default KarirPage;
