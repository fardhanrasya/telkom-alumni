'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Metadata } from 'next';
import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import AlumniCard, { Alumni } from '@/components/AlumniCard';
import AlumniCardSkeleton from '@/components/AlumniCardSkeleton';
import Pagination from '@/components/Pagination';
import Image from 'next/image';
// Menggunakan API route lokal untuk menghindari masalah CORS

// Filter options
// Opsi filter sesuai dengan schema Sanity
const majors = ['Semua', 'rpl', 'tkj', 'mm', 'tei'];
const majorLabels: Record<string, string> = {
  'Semua': 'Semua Jurusan',
  'rpl': 'Rekayasa Perangkat Lunak',
  'tkj': 'Teknik Komputer dan Jaringan',
  'mm': 'Multimedia',
  'tei': 'Teknik Elektronika Industri',
};
const graduationYears = ['Semua', '2005-2009', '2010-2015', '2016-2020', '2021-Sekarang'];

// Komponen ini menggunakan useSearchParams dan akan dibungkus dengan Suspense
const AlumniContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Ambil parameter dari URL
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const majorParam = searchParams.get('major');
  const yearParam = searchParams.get('year');
  
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(pageParam ? parseInt(pageParam) : 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(9); // Jumlah item per halaman

  // State untuk filter
  const [searchTerm, setSearchTerm] = useState(searchParam || '');
  const [selectedMajor, setSelectedMajor] = useState(majorParam || 'Semua');
  const [selectedYear, setSelectedYear] = useState(yearParam || 'Semua');
  const [isSearching, setIsSearching] = useState(false);
  
  // State untuk query terakhir yang digunakan
  const [lastQuery, setLastQuery] = useState<{
    searchTerm: string;
    major: string;
    yearRange: string;
    page: number;
  }>({ 
    searchTerm: searchParam || '', 
    major: majorParam || 'Semua', 
    yearRange: yearParam || 'Semua', 
    page: pageParam ? parseInt(pageParam) : 1 
  });

  // Fungsi untuk mengambil data alumni menggunakan API route lokal
  const fetchAlumni = async (page: number, filters: { searchTerm?: string; major?: string; yearRange?: string; }) => {
    setLoading(true);
    try {
      // Membangun URL dengan query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', itemsPerPage.toString());
      
      if (filters.searchTerm) {
        queryParams.append('search', filters.searchTerm);
      }
      
      if (filters.major) {
        queryParams.append('major', filters.major);
      }
      
      if (filters.yearRange) {
        queryParams.append('year', filters.yearRange);
      }
      
      // Panggil API route lokal
      console.log('Mengambil data alumni dengan filter:', filters);
      const response = await fetch(`/api/alumni?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data alumni');
      }
      
      const result = await response.json();
      console.log('Data alumni yang diterima:', result);
      
      setAlumni(result.alumni);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalItems);
      
      // Memastikan bahwa nilai yang diset ke lastQuery selalu memiliki tipe data yang benar
      setLastQuery({
        searchTerm: filters.searchTerm || '',
        major: filters.major || 'Semua',
        yearRange: filters.yearRange || 'Semua',
        page
      });
    } catch (error) {
      console.error('Error mengambil data alumni:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk memperbarui URL dengan parameter filter dan halaman
  const updateURLWithFilters = (filters: { page: number; search?: string; major?: string; year?: string }) => {
    const params = new URLSearchParams();
    
    if (filters.page && filters.page > 1) {
      params.set('page', filters.page.toString());
    }
    
    if (filters.search && filters.search.trim() !== '') {
      params.set('search', filters.search);
    }
    
    if (filters.major && filters.major !== 'Semua') {
      params.set('major', filters.major);
    }
    
    if (filters.year && filters.year !== 'Semua') {
      params.set('year', filters.year);
    }
    
    const queryString = params.toString();
    const url = `/alumni${queryString ? `?${queryString}` : ''}`;
    
    // Gunakan router.replace untuk memperbarui URL tanpa reload halaman
    router.replace(url, { scroll: false });
  };

  // Pertama kali komponen di-mount atau ketika URL berubah, ambil data alumni
  useEffect(() => {
    console.log('Komponen di-mount atau URL berubah, mengambil data alumni...');
    fetchAlumni(
      pageParam ? parseInt(pageParam) : 1,
      { 
        searchTerm: searchParam || '', 
        major: majorParam || 'Semua', 
        yearRange: yearParam || 'Semua' 
      }
    );
  }, [pageParam, searchParam, majorParam, yearParam]);

  // Handler untuk mengubah halaman
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Perbarui URL dengan parameter halaman yang baru
    updateURLWithFilters({
      page, 
      search: lastQuery.searchTerm,
      major: lastQuery.major !== 'Semua' ? lastQuery.major : undefined,
      year: lastQuery.yearRange !== 'Semua' ? lastQuery.yearRange : undefined
    });
    
    fetchAlumni(page, { 
      searchTerm: lastQuery.searchTerm, 
      major: lastQuery.major, 
      yearRange: lastQuery.yearRange 
    });
    
    // Scroll ke atas halaman saat mengganti halaman
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler untuk melakukan pencarian
  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(1); // Reset ke halaman 1 saat melakukan pencarian baru
    
    // Perbarui URL dengan parameter pencarian
    updateURLWithFilters({
      page: 1,
      search: searchTerm,
      major: selectedMajor !== 'Semua' ? selectedMajor : undefined,
      year: selectedYear !== 'Semua' ? selectedYear : undefined
    });
    
    // Jalankan pencarian dengan filter yang dipilih
    fetchAlumni(1, {
      searchTerm,
      major: selectedMajor,
      yearRange: selectedYear
    });
    
    setTimeout(() => {
      setIsSearching(false);
    }, 500); // Delay untuk UI feedback
  };

  // Handler untuk reset filter
  const handleResetFilter = () => {
    setSearchTerm('');
    setSelectedMajor('Semua');
    setSelectedYear('Semua');
    setCurrentPage(1);
    
    // Perbarui URL untuk menghapus semua parameter
    router.replace('/alumni', { scroll: false });
    
    // Jalankan pencarian dengan filter direset
    fetchAlumni(1, {
      searchTerm: '',
      major: 'Semua',
      yearRange: 'Semua'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/alumni-hero.jpg" 
            alt="Alumni SMK Telkom Jakarta" 
            fill 
            priority
            className="object-cover object-center brightness-[0.7]" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Direktori Alumni
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            Temukan dan terhubung dengan alumni SMK Telkom Jakarta dari berbagai angkatan
          </p>
          <div className="mt-8 animate-bounce">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">

        {/* Filter dan Pencarian */}
        <div className="mb-10 overflow-hidden rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-200/50">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Pencarian */}
            <div className="md:col-span-3">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Cari Alumni
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full rounded-md border-gray-300 px-4 py-2 shadow-sm text-gray-800 placeholder-gray-500 focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="Nama, jabatan, atau perusahaan"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            {/* Filter Jurusan */}
            <div>
              <label htmlFor="major" className="block text-sm font-medium text-gray-700">
                Jurusan
              </label>
              <select
                id="major"
                name="major"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base shadow-sm text-gray-800 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
              >
                {majors.map((major) => (
                  <option key={major} value={major}>
                    {majorLabels[major]}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Tahun Lulus */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Tahun Lulus
              </label>
              <select
                id="year"
                name="year"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base shadow-sm text-gray-800 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
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

            {/* Tombol Filter */}
            <div className="flex items-end gap-2">
              <Button 
                onClick={handleSearch}
                disabled={isSearching}
                className="flex-1"
              >
                {isSearching ? 'Mencari...' : 'Cari'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleResetFilter}
                disabled={isSearching}
                className="flex-1"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Hasil Pencarian */}
        <div className="mb-4">
          <p className="text-sm text-gray-700">
            {totalItems > 0 ? (
              <>
                Menampilkan <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> sampai{' '}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari{' '}
                <span className="font-medium">{totalItems}</span> alumni
              </>
            ) : loading ? (
              'Memuat data...'
            ) : (
              'Tidak ada alumni yang ditemukan'
            )}
          </p>
        </div>

        {/* Grid Alumni */}
        {loading ? (
          // Skeleton saat loading
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {[...Array(itemsPerPage)].map((_, index) => (
              <AlumniCardSkeleton key={index} />
            ))}
          </div>
        ) : alumni.length > 0 ? (
          // Tampilkan alumni jika ada
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {alumni.map((alumni) => (
              <AlumniCard key={alumni._id} alumni={alumni} />
            ))}
          </div>
        ) : (
          // Tampilkan pesan jika tidak ada alumni
          <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-gray-50 p-10 text-center">
            <p className="text-lg font-medium text-gray-600">Tidak ada alumni yang ditemukan</p>
            <p className="mt-2 text-sm text-gray-500">Coba ubah filter pencarian Anda</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <>
            {/* SEO Metadata untuk Paginasi */}
            <Head>
              {currentPage > 1 && (
                <link
                  rel="prev"
                  href={`/alumni?${new URLSearchParams({
                    ...(lastQuery.searchTerm ? { search: lastQuery.searchTerm } : {}),
                    ...(lastQuery.major !== 'Semua' ? { major: lastQuery.major } : {}),
                    ...(lastQuery.yearRange !== 'Semua' ? { year: lastQuery.yearRange } : {}),
                    page: (currentPage - 1).toString(),
                  }).toString()}`}
                />
              )}
              {currentPage < totalPages && (
                <link
                  rel="next"
                  href={`/alumni?${new URLSearchParams({
                    ...(lastQuery.searchTerm ? { search: lastQuery.searchTerm } : {}),
                    ...(lastQuery.major !== 'Semua' ? { major: lastQuery.major } : {}),
                    ...(lastQuery.yearRange !== 'Semua' ? { year: lastQuery.yearRange } : {}),
                    page: (currentPage + 1).toString(),
                  }).toString()}`}
                />
              )}
            </Head>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

// Wrapper komponen dengan Suspense boundary
const AlumniPage = () => {
  return (
    <Suspense fallback={<div className="container mx-auto py-20 text-center">Memuat data alumni...</div>}>
      <AlumniContent />
    </Suspense>
  );
};

export default AlumniPage;
