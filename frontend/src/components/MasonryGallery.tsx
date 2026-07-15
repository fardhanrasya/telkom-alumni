"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Gallery, GalleryImage } from "@/sanity/services/gallery";
import { urlFor } from "@/sanity/utils";

interface MasonryGalleryProps {
  initialImages?: any[];
  initialHasMore: boolean;
  initialTotalImages?: number;
  initialCurrentPage?: number;
}

interface MasonryItem {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  slug: string;
  category?: string;
}

interface PaginationInfo {
  totalImages: number;
  currentPage: number;
  itemsPerPage: number;
  hasMore: boolean;
  totalPages: number;
}

const ITEMS_PER_PAGE = 10;

export default function MasonryGallery({
  initialImages = [],
  initialHasMore,
  initialTotalImages = 0,
  initialCurrentPage = 1,
}: MasonryGalleryProps) {
  const [displayedItems, setDisplayedItems] = useState<MasonryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalImages: initialTotalImages,
    currentPage: initialCurrentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    hasMore: initialHasMore,
    totalPages: Math.ceil(initialTotalImages / ITEMS_PER_PAGE),
  });

  const categories = [
    { value: "all", label: "Semua" },
    { value: "kegiatan-sekolah", label: "Kegiatan Sekolah" },
    { value: "prestasi-siswa", label: "Prestasi Siswa" },
    { value: "fasilitas", label: "Fasilitas" },
    { value: "event", label: "Event" },
    { value: "lainnya", label: "Lainnya" },
  ];

  // Convert galleries to items
  const convertGalleriesToItems = useCallback(
    (galleries: Gallery[]): MasonryItem[] => {
      const allItems: MasonryItem[] = [];

      galleries.forEach((gallery) => {
        gallery.images.forEach((img: GalleryImage, index: number) => {
          allItems.push({
            id: `${gallery._id}-${index}`,
            src: urlFor(img.image.asset)?.width(600).quality(95).url() || "",
            alt: img.alt,
            width: img.image.asset.metadata.dimensions.width,
            height: img.image.asset.metadata.dimensions.height,
            title: gallery.title,
            slug: gallery.slug.current,
            category: gallery.category,
          });
        });
      });

      return allItems;
    },
    []
  );

  // Initialize with server-side data from props
  useEffect(() => {
    if (initialImages.length > 0) {
      // Convert server-side images to MasonryItem format
      const initialItems: MasonryItem[] = initialImages.map(
        (imageData: any) => ({
          id: imageData.id,
          src:
            urlFor(imageData.image.image.asset)?.width(600).quality(95).url() ||
            "",
          alt: imageData.image.alt,
          width: imageData.image.image.asset.metadata.dimensions.width,
          height: imageData.image.image.asset.metadata.dimensions.height,
          title: imageData.gallery.title,
          slug: imageData.gallery.slug.current,
          category: imageData.gallery.category,
        })
      );

      setDisplayedItems(initialItems);
      setPagination({
        totalImages: initialTotalImages,
        currentPage: initialCurrentPage,
        itemsPerPage: ITEMS_PER_PAGE,
        hasMore: initialHasMore,
        totalPages: Math.ceil(initialTotalImages / ITEMS_PER_PAGE),
      });
    } else {
      // Fallback: load from API if no initial data
      loadPage(1);
    }
  }, [initialImages, initialHasMore, initialTotalImages, initialCurrentPage]);

  // Load specific page via API route (server-side image-level pagination)
  const loadPage = useCallback(
    async (page: number, category: string = selectedCategory) => {
      if (loading) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/galeri?page=${page}&limit=${ITEMS_PER_PAGE}${
            category !== "all" ? `&category=${category}` : ""
          }&action=images`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const data = await response.json();
        const images = data.images || [];

        // Convert API response to MasonryItem format
        const items: MasonryItem[] = images.map((imageData: any) => ({
          id: imageData.id,
          src:
            urlFor(imageData.image.image.asset)?.width(600).quality(95).url() ||
            "",
          alt: imageData.image.alt,
          width: imageData.image.image.asset.metadata.dimensions.width,
          height: imageData.image.image.asset.metadata.dimensions.height,
          title: imageData.gallery.title,
          slug: imageData.gallery.slug.current,
          category: imageData.gallery.category,
        }));

        setDisplayedItems(items);
        setPagination({
          totalImages: data.pagination.totalImages,
          currentPage: page,
          itemsPerPage: ITEMS_PER_PAGE,
          hasMore: data.pagination.hasMore,
          totalPages: Math.ceil(data.pagination.totalImages / ITEMS_PER_PAGE),
        });

        // Scroll to top when changing pages
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error loading images:", error);
        setError("Gagal memuat galeri");
      } finally {
        setLoading(false);
      }
    },
    [loading, selectedCategory]
  );

  // Handle category change with API call (server-side image-level pagination)
  const handleCategoryChange = useCallback(
    async (category: string) => {
      setSelectedCategory(category);
      await loadPage(1, category);
    },
    [loadPage]
  );

  // Handle page change
  const handlePageChange = useCallback(
    async (page: number) => {
      if (page >= 1 && page <= pagination.totalPages && !loading) {
        await loadPage(page);
      }
    },
    [loadPage, pagination.totalPages, loading]
  );

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (currentPage > 4) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="w-full">
      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategoryChange(category.value)}
            disabled={loading}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${
              selectedCategory === category.value
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-center">{error}</p>
          <button
            onClick={() => {
              setError(null);
              handleCategoryChange(selectedCategory);
            }}
            className="mt-2 mx-auto block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {displayedItems.map((item) => (
          <div key={item.id} className="break-inside-avoid mb-6">
            <Link href={`/galeri/${item.slug}`} className="block group">
              <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={600}
                  height={(600 * item.height) / item.width}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                  <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-gray-600">Memuat gambar...</span>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && !loading && (
        <div className="mt-12 flex flex-col items-center space-y-4">
          {/* Page Info */}
          <div className="text-sm text-gray-600 text-center">
            Menampilkan{" "}
            {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} -{" "}
            {Math.min(
              pagination.currentPage * pagination.itemsPerPage,
              pagination.totalImages
            )}{" "}
            dari {pagination.totalImages} gambar
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1 || loading}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="hidden sm:inline">Sebelumnya</span>
              <span className="sm:hidden">‹</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof page === "number"
                      ? handlePageChange(page)
                      : undefined
                  }
                  disabled={typeof page !== "number" || loading}
                  className={`min-w-[40px] px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    page === pagination.currentPage
                      ? "bg-primary text-white shadow-sm"
                      : typeof page === "number"
                      ? "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      : "text-gray-400 cursor-default bg-transparent"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={
                pagination.currentPage === pagination.totalPages || loading
              }
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <span className="sm:hidden">›</span>
            </button>
          </div>
        </div>
      )}

      {displayedItems.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
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
            <p className="text-gray-500 text-lg">
              Tidak ada gambar untuk kategori ini.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Coba pilih kategori lain atau kembali lagi nanti.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
