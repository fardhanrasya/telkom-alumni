"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { Button } from "@/components/ui/Button";
import Pagination from "@/components/Pagination";
import { formatDate, formatTime } from "@/lib/utils";

// Interface untuk data acara
interface LocationObject {
  name: string;
  address?: string;
  city?: string;
  mapLink?: string;
}

interface Speaker {
  name: string;
  title?: string;
  company?: string;
  image?: {
    asset?: {
      _ref: string;
    };
  };
}

interface Event {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  startDate: string;
  endDate?: string;
  location: string | LocationObject;
  isVirtual: boolean;
  virtualLink?: string;
  imageUrl?: string;
  description: string | any; // Bisa string atau portable text
  speakers?: Speaker[];
}

// Komponen ini menggunakan useSearchParams dan akan dibungkus dengan Suspense
const EventsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil parameter dari URL
  const pageParam = searchParams.get("page");
  const searchParam = searchParams.get("search");
  const typeParam = searchParams.get("type");

  // State untuk data dan loading
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    pageParam ? parseInt(pageParam) : 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(6);

  // State untuk filter
  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [selectedType, setSelectedType] = useState(typeParam || "all");
  const [isSearching, setIsSearching] = useState(false);

  // State untuk query terakhir
  const [lastQuery, setLastQuery] = useState({
    searchTerm: searchParam || "",
    type: typeParam || "all",
    page: pageParam ? parseInt(pageParam) : 1,
  });

  // Fungsi untuk mengambil data acara
  const fetchEvents = async (
    page: number,
    filters: { searchTerm?: string; type?: string }
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

      if (filters.type && filters.type !== "all") {
        queryParams.append("type", filters.type);
      }

      // Panggil API route
      const response = await fetch(`/api/acara?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error("Gagal mengambil data acara");
      }

      const result = await response.json();

      setEvents(result.events);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalItems);

      setLastQuery({
        searchTerm: filters.searchTerm || "",
        type: filters.type || "all",
        page,
      });
    } catch (error) {
      console.error("Error mengambil data acara:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk memperbarui URL dengan parameter filter dan halaman
  const updateURLWithFilters = (filters: {
    page: number;
    search?: string;
    type?: string;
  }) => {
    const params = new URLSearchParams();

    if (filters.page > 1) {
      params.set("page", filters.page.toString());
    }

    if (filters.search) {
      params.set("search", filters.search);
    }

    if (filters.type && filters.type !== "all") {
      params.set("type", filters.type);
    }

    const newUrl = `/acara${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(newUrl, { scroll: false });
  };

  // Effect untuk mengambil data saat komponen dimount atau parameter URL berubah
  useEffect(() => {
    fetchEvents(currentPage, { searchTerm, type: selectedType });
  }, [currentPage]);

  // Handler untuk mengubah halaman
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURLWithFilters({
      page,
      search: searchTerm,
      type: selectedType,
    });
  };

  // Handler untuk melakukan pencarian
  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(1);

    fetchEvents(1, { searchTerm, type: selectedType })
      .then(() => {
        updateURLWithFilters({
          page: 1,
          search: searchTerm,
          type: selectedType,
        });
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  // Handler untuk reset filter
  const handleResetFilter = () => {
    setSearchTerm("");
    setSelectedType("all");
    setCurrentPage(1);

    fetchEvents(1, { searchTerm: "", type: "all" }).then(() => {
      updateURLWithFilters({ page: 1 });
    });
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Acara & Kegiatan
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Temukan berbagai acara menarik yang diselenggarakan oleh alumni dan
            SMK Telkom Jakarta
          </p>
        </div>

        {/* Filter dan Pencarian */}
        <div className="mb-8 rounded-xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            Cari Acara
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {/* Pencarian */}
            <div className="md:col-span-2">
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Kata Kunci
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  placeholder="Cari berdasarkan judul, deskripsi, atau lokasi..."
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 bg-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 shadow-sm text-gray-900 font-medium placeholder:text-gray-600"
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

            {/* Filter Tipe Acara */}
            <div>
              <label
                htmlFor="eventType"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Tipe Acara
              </label>
              <div className="relative">
                <select
                  id="eventType"
                  className="appearance-none w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 shadow-sm text-gray-900 font-medium"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">Semua Acara</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Tombol Filter */}
            <div className="flex items-end gap-3 md:col-span-3 mt-2">
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {isSearching ? "Mencari..." : "Cari Acara"}
              </Button>
              <Button
                variant="outline"
                onClick={handleResetFilter}
                disabled={isSearching}
                className="flex-1 py-3 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Hasil Pencarian */}
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
                dari <span className="font-medium">{totalItems}</span> acara
              </>
            ) : loading ? (
              "Memuat data..."
            ) : (
              "Tidak ada acara yang ditemukan"
            )}
          </p>
        </div>

        {/* Grid Acara */}
        {loading ? (
          // Skeleton saat loading
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(itemsPerPage)].map((_, index) => (
              <div
                key={index}
                className="flex h-96 animate-pulse flex-col overflow-hidden rounded-xl bg-gray-200"
              ></div>
            ))}
          </div>
        ) : events.length > 0 ? (
          // Tampilkan acara jika ada
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event._id}
                className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200">
                      <span className="text-gray-500">Tidak ada gambar</span>
                    </div>
                  )}
                  {event.isVirtual && (
                    <div className="absolute right-2 top-2 rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">
                      Online
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {/* Header dengan judul dan tanggal */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-primary-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      {event.isVirtual && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          <svg
                            className="mr-1 h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Online
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-xl font-bold text-gray-900 line-clamp-2">
                      {event.title}
                    </h3>
                  </div>

                  {/* Waktu acara */}
                  <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <span className="text-gray-700">
                        {formatTime(event.startDate)}
                      </span>
                      {event.endDate && (
                        <span className="text-gray-500">
                          {" "}
                          - {formatTime(event.endDate)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Lokasi acara */}
                  <div className="mb-3 flex items-start gap-2 text-sm text-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      {typeof event.location === "object" && event.location ? (
                        <>
                          <span className="text-gray-700 font-medium">
                            {event.location.name || "Lokasi tidak tersedia"}
                          </span>
                          {event.location.city && (
                            <span className="text-gray-500 block text-xs mt-0.5">
                              {event.location.city}
                            </span>
                          )}
                        </>
                      ) : (
                        <span>{event.location || "Lokasi tidak tersedia"}</span>
                      )}
                    </div>
                  </div>

                  {/* Deskripsi acara */}
                  <div className="mb-4 flex-1 text-sm text-gray-600 line-clamp-3">
                    {typeof event.description === "string"
                      ? event.description
                      : Array.isArray(event.description) &&
                          event.description.length > 0
                        ? // Ekstrak teks dari portable text blocks
                          event.description
                            .filter(
                              (block: any) =>
                                block._type === "block" && block.children
                            )
                            .map((block: any) =>
                              block.children
                                .filter(
                                  (child: any) =>
                                    child._type === "span" && child.text
                                )
                                .map((child: any) => child.text)
                                .join("")
                            )
                            .join(" ")
                            .substring(0, 150) +
                          (event.description.length > 0 ? "..." : "")
                        : "Klik untuk melihat detail acara"}
                  </div>

                  {/* Pembicara (jika ada) */}
                  {Array.isArray(event.speakers) &&
                    event.speakers.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-1 mb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-primary-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                            />
                          </svg>
                          <span className="text-xs font-medium text-primary-700">
                            Pembicara:
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {event.speakers
                            .slice(0, 2)
                            .map((speaker: Speaker, index: number) => (
                              <div
                                key={index}
                                className="flex items-center gap-1.5 bg-gray-50 rounded-full px-2 py-1"
                              >
                                <div className="h-5 w-5 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold overflow-hidden">
                                  {speaker.image?.asset?._ref ? (
                                    <Image
                                      src={`https://cdn.sanity.io/images/1btnolup/dev/${speaker.image.asset._ref.replace("image-", "").replace("-jpg", ".jpg").replace("-png", ".png").replace("-webp", ".webp")}`}
                                      alt={speaker.name}
                                      width={20}
                                      height={20}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    speaker.name.charAt(0)
                                  )}
                                </div>
                                <span className="text-xs text-gray-700">
                                  {speaker.name}
                                </span>
                              </div>
                            ))}
                          {event.speakers.length > 2 && (
                            <div className="text-xs text-gray-500 flex items-center">
                              +{event.speakers.length - 2} lainnya
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Tombol lihat detail */}
                  <div className="mt-auto">
                    <Link href={`/acara/${event.slug.current}`}>
                      <Button
                        variant="outline"
                        className="w-full hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        Lihat Detail
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Tampilkan pesan jika tidak ada acara
          <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-gray-50 p-10 text-center">
            <p className="text-lg font-medium text-gray-600">
              Tidak ada acara yang ditemukan
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
};

// Wrapper komponen yang menggunakan Suspense untuk mengatasi masalah client-side rendering
const EventsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-20 text-center">Memuat...</div>
      }
    >
      <EventsContent />
    </Suspense>
  );
};

export default EventsPage;
