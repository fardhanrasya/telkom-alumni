"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Pagination from "@/components/Pagination";
import { Metadata } from "next";

// Interface untuk data berita
interface NewsTag {
  name: string;
  slug: {
    current: string;
  };
}

interface News {
  _id: string;
  title: string;
  subtitle?: string;
  slug: {
    current: string;
  };
  publishedAt: string;
  updatedAt?: string;
  excerpt?: string;
  featured?: boolean;
  status?: string;
  mainImageUrl?: string;
  authorName?: string;
  authorImage?: string;
  tags?: string[];
}

// Filter options
const years = ["Semua", "2023", "2024", "2025"];

// Format tanggal untuk tampilan yang lebih baik
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// Komponen yang menggunakan useSearchParams dibungkus dengan Suspense
const BeritaContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil parameter dari URL
  const pageParam = searchParams.get("page");
  const searchParam = searchParams.get("search");
  const tagParam = searchParams.get("tag");
  const yearParam = searchParams.get("year");

  const [news, setNews] = useState<News[]>([]);
  const [featuredNews, setFeaturedNews] = useState<News | null>(null);
  const [tags, setTags] = useState<NewsTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    pageParam ? parseInt(pageParam) : 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(9); // Jumlah item per halaman

  // State untuk filter
  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [selectedTag, setSelectedTag] = useState(tagParam || "");
  const [selectedYear, setSelectedYear] = useState(yearParam || "Semua");
  const [isSearching, setIsSearching] = useState(false);

  // State untuk query terakhir yang digunakan
  const [lastQuery, setLastQuery] = useState<{
    searchTerm: string;
    tag: string;
    year: string;
    page: number;
  }>({
    searchTerm: searchParam || "",
    tag: tagParam || "",
    year: yearParam || "Semua",
    page: pageParam ? parseInt(pageParam) : 1,
  });

  // Fungsi untuk mengambil data berita menggunakan API route
  const fetchNews = async (
    page: number,
    filters: { searchTerm?: string; tag?: string; year?: string }
  ) => {
    setLoading(true);
    try {
      // Membangun URL dengan query parameters
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", itemsPerPage.toString());

      if (filters.searchTerm) {
        queryParams.append("search", filters.searchTerm);
      }

      if (filters.tag) {
        queryParams.append("tag", filters.tag);
      }

      if (filters.year && filters.year !== "Semua") {
        queryParams.append("year", filters.year);
      }

      // Panggil API route
      const response = await fetch(`/api/berita?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error("Gagal mengambil data berita");
      }

      const result = await response.json();

      setNews(result.news);
      setTotalPages(result.pagination.totalPages);
      setTotalItems(result.pagination.totalItems);

      // Ambil berita unggulan jika halaman pertama
      if (page === 1) {
        try {
          // Panggil API khusus untuk mendapatkan berita unggulan
          const featuredResponse = await fetch("/api/berita/featured");
          if (featuredResponse.ok) {
            const featuredResult = await featuredResponse.json();
            if (featuredResult.news && featuredResult.news.length > 0) {
              setFeaturedNews(featuredResult.news[0]);
            } else {
              // Jika tidak ada berita unggulan, gunakan berita pertama
              const featured =
                result.news.find((item: News) => item.featured) ||
                result.news[0];
              setFeaturedNews(featured);
            }
          }
        } catch (error) {
          console.error("Error mengambil berita unggulan:", error);
          // Fallback ke cara lama jika API berita unggulan gagal
          const featured =
            result.news.find((item: News) => item.featured) || result.news[0];
          setFeaturedNews(featured);
        }
      }

      // Memastikan bahwa nilai yang diset ke lastQuery selalu memiliki tipe data yang benar
      setLastQuery({
        searchTerm: filters.searchTerm || "",
        tag: filters.tag || "",
        year: filters.year || "Semua",
        page,
      });
    } catch (error) {
      console.error("Error mengambil data berita:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengambil data tag berita
  const fetchTags = async () => {
    try {
      const response = await fetch("/api/berita/tags");

      if (!response.ok) {
        throw new Error("Gagal mengambil data tag");
      }

      const result = await response.json();
      setTags(result.tags);
    } catch (error) {
      console.error("Error mengambil data tag:", error);
    }
  };

  // Fungsi untuk memperbarui URL dengan parameter filter dan halaman
  const updateURLWithFilters = (filters: {
    page: number;
    search?: string;
    tag?: string;
    year?: string;
  }) => {
    const params = new URLSearchParams();

    if (filters.page && filters.page > 1) {
      params.set("page", filters.page.toString());
    }

    if (filters.search && filters.search.trim() !== "") {
      params.set("search", filters.search);
    }

    if (filters.tag && filters.tag !== "") {
      params.set("tag", filters.tag);
    }

    if (filters.year && filters.year !== "Semua") {
      params.set("year", filters.year);
    }

    const queryString = params.toString();
    const url = `/berita${queryString ? `?${queryString}` : ""}`;

    // Gunakan router.replace untuk memperbarui URL tanpa reload halaman
    router.replace(url, { scroll: false });
  };

  // Pertama kali komponen di-mount atau ketika URL berubah, ambil data berita dan tag
  useEffect(() => {
    fetchNews(pageParam ? parseInt(pageParam) : 1, {
      searchTerm: searchParam || "",
      tag: tagParam || "",
      year: yearParam || "Semua",
    });
    fetchTags();
  }, [pageParam, searchParam, tagParam, yearParam]);

  // Handler untuk mengubah halaman
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Perbarui URL dengan parameter halaman yang baru
    updateURLWithFilters({
      page,
      search: lastQuery.searchTerm,
      tag: lastQuery.tag,
      year: lastQuery.year !== "Semua" ? lastQuery.year : undefined,
    });

    fetchNews(page, {
      searchTerm: lastQuery.searchTerm,
      tag: lastQuery.tag,
      year: lastQuery.year,
    });

    // Scroll ke atas halaman saat mengganti halaman
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler untuk melakukan pencarian
  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(1); // Reset ke halaman 1 saat melakukan pencarian baru

    // Perbarui URL dengan parameter pencarian
    updateURLWithFilters({
      page: 1,
      search: searchTerm,
      tag: selectedTag,
      year: selectedYear !== "Semua" ? selectedYear : undefined,
    });

    // Jalankan pencarian dengan filter yang dipilih
    fetchNews(1, {
      searchTerm,
      tag: selectedTag,
      year: selectedYear,
    });

    setTimeout(() => {
      setIsSearching(false);
    }, 500); // Delay untuk UI feedback
  };

  // Handler untuk reset filter
  const handleResetFilter = () => {
    setSearchTerm("");
    setSelectedTag("");
    setSelectedYear("Semua");
    setCurrentPage(1);

    // Reset URL dan ambil data tanpa filter
    updateURLWithFilters({ page: 1 });
    fetchNews(1, { searchTerm: "", tag: "", year: "Semua" });
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline Berita Unggulan */}
        {!loading && featuredNews && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Berita Unggulan
              </h2>
              <div className="ml-4 h-1 bg-primary flex-grow rounded-full"></div>
            </div>
            <Link
              href={`/berita/${featuredNews.slug.current}`}
              className="group block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="grid md:grid-cols-5 gap-6">
                <div className="md:col-span-3 relative h-64 md:h-96">
                  {featuredNews.mainImageUrl &&
                  featuredNews.mainImageUrl !== "" ? (
                    <Image
                      src={featuredNews.mainImageUrl}
                      alt={featuredNews.title || "Berita"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  {featuredNews.featured && (
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                      Unggulan
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center mb-4 space-x-3">
                    <span className="bg-primary-50 text-primary text-xs px-3 py-1 rounded-full font-medium">
                      {formatDate(featuredNews.publishedAt)}
                    </span>
                    {featuredNews.tags && featuredNews.tags.length > 0 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-medium">
                        {featuredNews.tags[0]}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-200">
                    {featuredNews.title}
                  </h3>
                  {featuredNews.subtitle && (
                    <p className="text-lg text-gray-700 mb-3">
                      {featuredNews.subtitle}
                    </p>
                  )}
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {featuredNews.excerpt ||
                      "Baca selengkapnya tentang informasi terbaru dari komunitas alumni"}
                  </p>
                  <div className="mt-auto flex items-center">
                    <div className="text-primary font-medium group-hover:underline flex items-center">
                      Baca Selengkapnya
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Filter dan Pencarian */}
        <div className="mb-10 rounded-xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-primary"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            Cari Berita
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {/* Pencarian */}
            <div className="md:col-span-1">
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Kata Kunci
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Cari judul atau isi berita..."
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-4 pr-10 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Filter Tag */}
            <div>
              <label
                htmlFor="tag"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Kategori
              </label>
              <select
                id="tag"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="">Semua Kategori</option>
                {tags.map((tag) => (
                  <option key={tag.slug.current} value={tag.slug.current}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Tahun */}
            <div>
              <label
                htmlFor="year"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Tahun
              </label>
              <select
                id="year"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="mt-6 flex flex-wrap gap-3 md:justify-end">
            <Button
              variant="outline"
              onClick={handleResetFilter}
              className="flex items-center justify-center px-5 py-2.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Reset Filter
            </Button>
            <Button
              onClick={handleSearch}
              className="flex items-center justify-center px-5 py-2.5"
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Mencari...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Cari Berita
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
            <p className="text-center mt-4 text-gray-600">Memuat berita...</p>
          </div>
        )}

        {/* Grid Berita */}
        {!loading && news.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <Link
                key={item._id}
                href={`/berita/${item.slug.current}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200"
              >
                <div className="relative h-48 w-full">
                  {item.mainImageUrl && item.mainImageUrl !== "" ? (
                    <Image
                      src={item.mainImageUrl}
                      alt={item.title || "Berita"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                      <span className="text-gray-500">Tidak ada gambar</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center mb-2 gap-2">
                    <span className="text-sm text-primary font-medium">
                      {formatDate(item.publishedAt)}
                    </span>
                    {item.tags && item.tags.length > 0 && (
                      <span className="inline-block bg-primary-50 text-primary rounded-full px-2 py-1 text-xs font-semibold">
                        {item.tags[0]}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {item.excerpt || "Baca selengkapnya..."}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-primary font-medium hover:underline">
                      Baca Selengkapnya
                    </div>
                    {item.authorName && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span>oleh {item.authorName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Jika tidak ada berita */}
        {!loading && news.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <h3 className="text-2xl font-medium text-gray-900 mb-4">
              Belum ada berita tersedia
            </h3>
            <p className="text-gray-600">
              Silahkan coba dengan filter yang berbeda atau kembali lagi nanti
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Wrapper komponen dengan Suspense boundary
const BeritaPage = () => {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-20 text-center">
          Memuat berita...
        </div>
      }
    >
      <BeritaContent />
    </Suspense>
  );
};

export default BeritaPage;
