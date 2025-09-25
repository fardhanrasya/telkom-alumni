"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import AlumniCard, { Alumni } from "@/components/AlumniCard";
import AlumniCardSkeleton from "@/components/AlumniCardSkeleton";
import Pagination from "@/components/Pagination";

// Filter options
const majors = ["Semua", "rpl", "tkj", "mm", "tei"];
const majorLabels: Record<string, string> = {
  Semua: "Semua Jurusan",
  rpl: "Rekayasa Perangkat Lunak",
  tkj: "Teknik Komputer dan Jaringan",
  mm: "Multimedia",
  tei: "Teknik Elektronika Industri",
};
const graduationYears = [
  "Semua",
  "2005-2009",
  "2010-2015",
  "2016-2020",
  "2021-Sekarang",
];

export default function AlumniContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL parameters
  const pageParam = searchParams.get("page");
  const searchParam = searchParams.get("search");
  const majorParam = searchParams.get("major");
  const yearParam = searchParams.get("year");

  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    pageParam ? parseInt(pageParam) : 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(9); // Items per page

  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [selectedMajor, setSelectedMajor] = useState(majorParam || "Semua");
  const [selectedYear, setSelectedYear] = useState(yearParam || "Semua");
  const [isSearching, setIsSearching] = useState(false);

  // State for last used query
  const [lastQuery, setLastQuery] = useState<{
    searchTerm: string;
    major: string;
    yearRange: string;
    page: number;
  }>({
    searchTerm: searchParam || "",
    major: majorParam || "Semua",
    yearRange: yearParam || "Semua",
    page: pageParam ? parseInt(pageParam) : 1,
  });

  // Function to fetch alumni data using local API route
  const fetchAlumni = useCallback(
    async (
      page: number,
      filters: { searchTerm?: string; major?: string; yearRange?: string }
    ) => {
      setLoading(true);
      try {
        // Build URL with query parameters
        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        queryParams.append("limit", itemsPerPage.toString());

        if (filters.searchTerm) {
          queryParams.append("search", filters.searchTerm);
        }

        if (filters.major) {
          queryParams.append("major", filters.major);
        }

        if (filters.yearRange) {
          queryParams.append("year", filters.yearRange);
        }

        // Call local API route
        const response = await fetch(`/api/alumni?${queryParams.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch alumni data");
        }

        const result = await response.json();

        setAlumni(result.alumni);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);

        setLastQuery({
          searchTerm: filters.searchTerm || "",
          major: filters.major || "Semua",
          yearRange: filters.yearRange || "Semua",
          page,
        });
      } catch (error) {
        console.error("Error fetching alumni data:", error);
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage]
  );

  // Function to update URL with filter parameters and page
  const updateURLWithFilters = (filters: {
    page: number;
    search?: string;
    major?: string;
    year?: string;
  }) => {
    const params = new URLSearchParams();

    if (filters.page && filters.page > 1) {
      params.set("page", filters.page.toString());
    }

    if (filters.search && filters.search.trim() !== "") {
      params.set("search", filters.search);
    }

    if (filters.major && filters.major !== "Semua") {
      params.set("major", filters.major);
    }

    if (filters.year && filters.year !== "Semua") {
      params.set("year", filters.year);
    }

    const queryString = params.toString();
    const url = `/alumni${queryString ? `?${queryString}` : ""}`;

    router.replace(url, { scroll: false });
  };

  // Fetch alumni data when component mounts or URL changes
  useEffect(() => {
    fetchAlumni(pageParam ? parseInt(pageParam) : 1, {
      searchTerm: searchParam || "",
      major: majorParam || "Semua",
      yearRange: yearParam || "Semua",
    });
  }, [pageParam, searchParam, majorParam, yearParam, fetchAlumni]);

  // Handler for page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Update URL with new page parameter
    updateURLWithFilters({
      page,
      search: lastQuery.searchTerm,
      major: lastQuery.major !== "Semua" ? lastQuery.major : undefined,
      year: lastQuery.yearRange !== "Semua" ? lastQuery.yearRange : undefined,
    });

    fetchAlumni(page, {
      searchTerm: lastQuery.searchTerm,
      major: lastQuery.major,
      yearRange: lastQuery.yearRange,
    });

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler for search
  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(1); // Reset to page 1 for new search

    // Update URL with search parameters
    updateURLWithFilters({
      page: 1,
      search: searchTerm,
      major: selectedMajor !== "Semua" ? selectedMajor : undefined,
      year: selectedYear !== "Semua" ? selectedYear : undefined,
    });

    // Run search with selected filters
    fetchAlumni(1, {
      searchTerm,
      major: selectedMajor,
      yearRange: selectedYear,
    });

    setTimeout(() => {
      setIsSearching(false);
    }, 500); // Delay for UI feedback
  };

  // Handler for filter reset
  const handleResetFilter = () => {
    setSearchTerm("");
    setSelectedMajor("Semua");
    setSelectedYear("Semua");
    setCurrentPage(1);

    // Update URL to remove all parameters
    router.replace("/alumni", { scroll: false });

    // Run search with reset filters
    fetchAlumni(1, {
      searchTerm: "",
      major: "Semua",
      yearRange: "Semua",
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
            Temukan dan terhubung dengan alumni SMK Telkom Jakarta dari berbagai
            angkatan
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
        {/* Filter and Search */}
        <div className="mb-10 overflow-hidden rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-200/50">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Search */}
            <div className="md:col-span-3">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700"
              >
                Cari Alumni
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full rounded-md border-gray-300 px-4 py-2 text-gray-800 placeholder-gray-500 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="Nama, jabatan, atau perusahaan"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>

            {/* Major Filter */}
            <div>
              <label
                htmlFor="major"
                className="block text-sm font-medium text-gray-700"
              >
                Jurusan
              </label>
              <select
                id="major"
                name="major"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base text-gray-800 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
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

            {/* Graduation Year Filter */}
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700"
              >
                Tahun Lulus
              </label>
              <select
                id="year"
                name="year"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base text-gray-800 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
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

            {/* Filter Buttons */}
            <div className="flex items-end gap-2">
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="flex-1"
              >
                {isSearching ? "Mencari..." : "Cari"}
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

        {/* Search Results */}
        <div className="mb-4">
          <p className="text-sm text-gray-700">
            {totalItems > 0 ? (
              <>
                Menampilkan{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                sampai{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, totalItems)}
                </span>{" "}
                dari <span className="font-medium">{totalItems}</span> alumni
              </>
            ) : loading ? (
              "Memuat data..."
            ) : (
              "Tidak ada alumni yang ditemukan"
            )}
          </p>
        </div>

        {/* Alumni Grid */}
        {loading ? (
          // Skeleton loading state
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-3">
            {[...Array(itemsPerPage)].map((_, index) => (
              <AlumniCardSkeleton key={index} />
            ))}
          </div>
        ) : alumni.length > 0 ? (
          // Show alumni if available
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-3">
            {alumni.map((alumni) => (
              <AlumniCard key={alumni._id} alumni={alumni} />
            ))}
          </div>
        ) : (
          // Show message if no alumni found
          <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-gray-50 p-10 text-center">
            <p className="text-lg font-medium text-gray-600">
              Tidak ada alumni yang ditemukan
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Coba ubah filter pencarian Anda
            </p>
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
}
