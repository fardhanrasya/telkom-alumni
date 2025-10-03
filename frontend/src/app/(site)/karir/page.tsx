"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Pagination from "@/components/Pagination";
import { urlFor } from "@/sanity/utils";

// Interface untuk data lowongan
interface Job {
  _id: string;
  title: string;
  company: string | { name: string; logo?: any };
  companyLogoUrl?: string;
  slug: { current: string };
  jobType: string;
  workplaceType: string;
  postedAt: string;
}

// Filter options
const jobTypes = [
  "Semua",
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
];
const workplaceTypes = ["Semua", "On-site", "Remote", "Hybrid"];

// Komponen yang menggunakan useSearchParams dibungkus dengan Suspense
const KarirContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil parameter dari URL
  const pageParam = searchParams.get("page");
  const searchParam = searchParams.get("search");
  const jobTypeParam = searchParams.get("jobType");
  const workplaceTypeParam = searchParams.get("workplaceType");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    pageParam ? parseInt(pageParam) : 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(8); // Jumlah item per halaman

  // State untuk filter
  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [selectedJobType, setSelectedJobType] = useState(
    jobTypeParam || "Semua"
  );
  const [selectedWorkplace, setSelectedWorkplace] = useState(
    workplaceTypeParam || "Semua"
  );
  const [isSearching, setIsSearching] = useState(false);

  // State untuk query terakhir yang digunakan
  const [lastQuery, setLastQuery] = useState<{
    searchTerm: string;
    jobType: string;
    workplaceType: string;
    page: number;
  }>({
    searchTerm: searchParam || "",
    jobType: jobTypeParam || "Semua",
    workplaceType: workplaceTypeParam || "Semua",
    page: pageParam ? parseInt(pageParam) : 1,
  });

  // Fungsi untuk mengambil data lowongan menggunakan API route lokal
  const fetchJobs = async (
    page: number,
    filters: { searchTerm?: string; jobType?: string; workplaceType?: string }
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

      if (filters.jobType && filters.jobType !== "Semua") {
        queryParams.append("jobType", filters.jobType);
      }

      if (filters.workplaceType && filters.workplaceType !== "Semua") {
        queryParams.append("workplaceType", filters.workplaceType);
      }

      // Panggil API route lokal
      console.log("Mengambil data lowongan dengan filter:", filters);
      const response = await fetch(`/api/karir?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error("Gagal mengambil data lowongan");
      }

      const result = await response.json();
      console.log("Data lowongan yang diterima:", result);

      setJobs(result.jobs);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalItems);

      // Memastikan bahwa nilai yang diset ke lastQuery selalu memiliki tipe data yang benar
      setLastQuery({
        searchTerm: filters.searchTerm || "",
        jobType: filters.jobType || "Semua",
        workplaceType: filters.workplaceType || "Semua",
        page,
      });
    } catch (error) {
      console.error("Error mengambil data lowongan:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk memperbarui URL dengan parameter filter dan halaman
  const updateURLWithFilters = (filters: {
    page: number;
    search?: string;
    jobType?: string;
    workplaceType?: string;
  }) => {
    const params = new URLSearchParams();

    if (filters.page && filters.page > 1) {
      params.set("page", filters.page.toString());
    }

    if (filters.search && filters.search.trim() !== "") {
      params.set("search", filters.search);
    }

    if (filters.jobType && filters.jobType !== "Semua") {
      params.set("jobType", filters.jobType);
    }

    if (filters.workplaceType && filters.workplaceType !== "Semua") {
      params.set("workplaceType", filters.workplaceType);
    }

    const queryString = params.toString();
    const url = `/karir${queryString ? `?${queryString}` : ""}`;

    // Gunakan router.replace untuk memperbarui URL tanpa reload halaman
    router.replace(url, { scroll: false });
  };

  // Pertama kali komponen di-mount atau ketika URL berubah, ambil data lowongan
  useEffect(() => {
    console.log(
      "Komponen di-mount atau URL berubah, mengambil data lowongan..."
    );
    fetchJobs(pageParam ? parseInt(pageParam) : 1, {
      searchTerm: searchParam || "",
      jobType: jobTypeParam || "Semua",
      workplaceType: workplaceTypeParam || "Semua",
    });
  }, [pageParam, searchParam, jobTypeParam, workplaceTypeParam]);

  // Handler untuk mengubah halaman
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Perbarui URL dengan parameter halaman yang baru
    updateURLWithFilters({
      page,
      search: lastQuery.searchTerm,
      jobType: lastQuery.jobType !== "Semua" ? lastQuery.jobType : undefined,
      workplaceType:
        lastQuery.workplaceType !== "Semua"
          ? lastQuery.workplaceType
          : undefined,
    });

    fetchJobs(page, {
      searchTerm: lastQuery.searchTerm,
      jobType: lastQuery.jobType,
      workplaceType: lastQuery.workplaceType,
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
      jobType: selectedJobType !== "Semua" ? selectedJobType : undefined,
      workplaceType:
        selectedWorkplace !== "Semua" ? selectedWorkplace : undefined,
    });

    // Jalankan pencarian dengan filter yang dipilih
    fetchJobs(1, {
      searchTerm,
      jobType: selectedJobType,
      workplaceType: selectedWorkplace,
    });

    setTimeout(() => {
      setIsSearching(false);
    }, 500); // Delay untuk UI feedback
  };

  // Handler untuk reset filter
  const handleResetFilter = () => {
    setSearchTerm("");
    setSelectedJobType("Semua");
    setSelectedWorkplace("Semua");
    setCurrentPage(1);

    // Reset URL parameters
    router.replace("/karir");

    // Ambil data tanpa filter
    fetchJobs(1, {
      searchTerm: "",
      jobType: "Semua",
      workplaceType: "Semua",
    });
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Lowongan Kerja
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Temukan peluang karir terbaru yang dibagikan oleh sesama alumni dan
            perusahaan partner
          </p>
        </div>

        {/* Filter dan Pencarian */}
        <div className="mb-8 rounded-lg bg-gradient-to-r from-gray-50 to-white p-6 shadow-md border border-gray-100">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Cari Lowongan
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700"
              >
                Kata Kunci
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
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
                <input
                  type="text"
                  id="search"
                  className="block w-full rounded-md border-gray-300 pl-10 py-3 text-gray-900 placeholder:text-gray-600 focus:border-primary focus:ring-primary text-base"
                  placeholder="Cari berdasarkan judul, perusahaan"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="jobType"
                className="block text-sm font-medium text-gray-700"
              >
                Jenis Pekerjaan
              </label>
              <select
                id="jobType"
                className="mt-1 block w-full rounded-md border-gray-300 py-3 shadow-sm focus:border-primary focus:ring-primary text-base text-gray-900"
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
              <label
                htmlFor="workplace"
                className="block text-sm font-medium text-gray-700"
              >
                Tipe Tempat Kerja
              </label>
              <select
                id="workplace"
                className="mt-1 block w-full rounded-md border-gray-300 py-3 shadow-sm focus:border-primary focus:ring-primary text-base text-gray-900"
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
          <div className="mt-4 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={handleResetFilter}
              className="px-4 py-2"
            >
              Reset Filter
            </Button>
            <Button
              onClick={handleSearch}
              className="px-4 py-2"
              disabled={isSearching}
            >
              {isSearching ? "Mencari..." : "Cari Lowongan"}
            </Button>
          </div>
        </div>

        {/* Hasil Pencarian */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Menampilkan {totalItems} lowongan kerja
          </p>
        </div>

        {/* Daftar Lowongan */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(itemsPerPage)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-lg bg-white p-6 shadow-md"
              >
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-md bg-gray-300"></div>
                    <div className="ml-4">
                      <div className="h-5 w-40 rounded bg-gray-300"></div>
                      <div className="mt-2 h-4 w-24 rounded bg-gray-200"></div>
                    </div>
                  </div>
                  <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto">
                    <div className="h-6 w-20 rounded-full bg-gray-300"></div>
                    <div className="h-6 w-20 rounded-full bg-gray-300"></div>
                    <div className="h-4 w-24 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Link
                    key={job._id}
                    href={`/karir/${job.slug.current}`}
                    className="block"
                  >
                    <div className="group overflow-hidden rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
                      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center">
                          <div className="relative h-12 w-12 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                            {typeof job.company !== "string" &&
                            job.company.logo ? (
                              <Image
                                src={urlFor(job.company.logo)?.url() || ""}
                                alt={
                                  typeof job.company === "string"
                                    ? job.company
                                    : job.company.name
                                }
                                className="object-contain"
                                fill
                              />
                            ) : (
                              <span className="text-xl font-bold text-primary">
                                {typeof job.company === "string"
                                  ? job.company.charAt(0)
                                  : job.company.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary">
                              {job.title}
                            </h3>
                            <div className="mt-1 flex items-center">
                              <span className="text-sm font-medium text-gray-700">
                                {typeof job.company === "string"
                                  ? job.company
                                  : job.company.name}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto">
                          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary">
                            {job.jobType}
                          </span>
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                            {job.workplaceType}
                          </span>
                          <span className="text-sm text-gray-500">
                            {job.postedAt}
                          </span>
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
            ) : (
              <div className="rounded-lg bg-white p-8 text-center shadow-md">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  Tidak ada lowongan yang ditemukan
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Coba ubah filter pencarian Anda atau cek kembali nanti untuk
                  lowongan baru.
                </p>
                <div className="mt-6">
                  <Button onClick={handleResetFilter}>Reset Filter</Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
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

// Wrapper komponen dengan Suspense boundary
const KarirPage = () => {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-20 text-center">
          Memuat lowongan karir...
        </div>
      }
    >
      <KarirContent />
    </Suspense>
  );
};

export default KarirPage;
