'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import AlumniCard, { Alumni } from '@/components/AlumniCard';
import AlumniCardSkeleton from '@/components/AlumniCardSkeleton';
import Pagination from '@/components/Pagination';
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

const AlumniPage = () => {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(8); // Jumlah item per halaman

  // State untuk filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('Semua');
  const [selectedYear, setSelectedYear] = useState('Semua');
  const [isSearching, setIsSearching] = useState(false);
  
  // State untuk query terakhir yang digunakan
  const [lastQuery, setLastQuery] = useState<{
    searchTerm: string;
    major: string;
    yearRange: string;
    page: number;
  }>({ searchTerm: '', major: 'Semua', yearRange: 'Semua', page: 1 });

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

  // Pertama kali komponen di-mount, ambil data alumni
  useEffect(() => {
    console.log('Komponen di-mount, mengambil data alumni...');
    fetchAlumni(currentPage, { searchTerm: '', major: 'Semua', yearRange: 'Semua' });
  }, []);

  // Handler untuk mengubah halaman
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
    
    // Log untuk debugging
    console.log('Melakukan pencarian dengan filter:', {
      searchTerm,
      major: selectedMajor,
      yearRange: selectedYear
    });
    
    fetchAlumni(1, { searchTerm, major: selectedMajor, yearRange: selectedYear })
      .finally(() => {
        setIsSearching(false);
      });
  };

  // Handler untuk reset filter
  const handleResetFilter = () => {
    setSearchTerm('');
    setSelectedMajor('Semua');
    setSelectedYear('Semua');
    setCurrentPage(1);
    console.log('Mereset filter dan mengambil semua alumni');
    fetchAlumni(1, { searchTerm: '', major: 'Semua', yearRange: 'Semua' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Direktori Alumni</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Temukan dan terhubung dengan alumni SMK Telkom Jakarta dari berbagai angkatan
          </p>
        </div>

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
                  className="block w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
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
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(itemsPerPage)].map((_, index) => (
              <AlumniCardSkeleton key={index} />
            ))}
          </div>
        ) : alumni.length > 0 ? (
          // Tampilkan alumni jika ada
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default AlumniPage;
