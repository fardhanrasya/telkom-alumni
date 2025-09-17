"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Gallery,
  GalleryImage,
  getGalleriesPaginated,
  getGalleriesByCategoryPaginated,
  getUpdatesSince,
} from "@/sanity/services/gallery";
import { urlFor } from "@/sanity/utils";
import { useGalleryUpdates } from "@/hooks/useGalleryUpdates";

interface MasonryGalleryProps {
  initialGalleries: Gallery[];
  initialHasMore: boolean;
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

const ITEMS_PER_PAGE = 12;

export default function MasonryGallery({
  initialGalleries,
  initialHasMore,
}: MasonryGalleryProps) {
  const [galleries, setGalleries] = useState<Gallery[]>(initialGalleries);
  const [items, setItems] = useState<MasonryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Use gallery updates hook
  const { hasUpdates, isChecking, updateInfo, resetUpdateState } =
    useGalleryUpdates({
      enabled: true,
      pollingInterval: 30000, // Check every 30 seconds
      onUpdateDetected: (info) => {
        setUpdateAvailable(true);
        console.log("Gallery updates detected:", info);
      },
      onError: (error) => {
        console.error("Update checking error:", error);
      },
    });

  const categories = [
    { value: "all", label: "Semua" },
    { value: "kegiatan-sekolah", label: "Kegiatan Sekolah" },
    { value: "prestasi-siswa", label: "Prestasi Siswa" },
    { value: "fasilitas", label: "Fasilitas" },
    { value: "event", label: "Event" },
    { value: "lainnya", label: "Lainnya" },
  ];

  const convertGalleriesToItems = useCallback(
    (galleries: Gallery[]): MasonryItem[] => {
      const allItems: MasonryItem[] = [];

      galleries.forEach((gallery) => {
        gallery.images.forEach((img: GalleryImage, index: number) => {
          allItems.push({
            id: `${gallery._id}-${index}`,
            src: urlFor(img.image.asset)?.width(400).quality(80).url() || "",
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

  const loadMoreGalleries = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const start = page * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      let newGalleries: Gallery[] = [];

      if (selectedCategory === "all") {
        newGalleries = await getGalleriesPaginated(start, end);
      } else {
        newGalleries = await getGalleriesByCategoryPaginated(
          selectedCategory,
          start,
          end
        );
      }

      if (newGalleries.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      if (newGalleries.length > 0) {
        setGalleries((prev) => [...prev, ...newGalleries]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error loading more galleries:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, selectedCategory]);

  // Reset when category changes
  const handleCategoryChange = useCallback(async (category: string) => {
    setSelectedCategory(category);
    setPage(1);
    setLoading(true);

    try {
      let newGalleries: Gallery[] = [];

      if (category === "all") {
        newGalleries = await getGalleriesPaginated(0, ITEMS_PER_PAGE - 1);
      } else {
        newGalleries = await getGalleriesByCategoryPaginated(
          category,
          0,
          ITEMS_PER_PAGE - 1
        );
      }

      setGalleries(newGalleries);
      setHasMore(newGalleries.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Error loading galleries by category:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh gallery data when updates are available
  const refreshGalleryData = useCallback(async () => {
    if (refreshing) return;

    setRefreshing(true);
    try {
      let newGalleries: Gallery[] = [];

      if (selectedCategory === "all") {
        newGalleries = await getGalleriesPaginated(0, ITEMS_PER_PAGE - 1);
      } else {
        newGalleries = await getGalleriesByCategoryPaginated(
          selectedCategory,
          0,
          ITEMS_PER_PAGE - 1
        );
      }

      setGalleries(newGalleries);
      setHasMore(newGalleries.length === ITEMS_PER_PAGE);
      setPage(1);
      setUpdateAvailable(false);
      resetUpdateState();
    } catch (error) {
      console.error("Error refreshing gallery data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, selectedCategory, resetUpdateState]);

  // Convert galleries to items when galleries change
  useEffect(() => {
    const allItems = convertGalleriesToItems(galleries);

    // When selectedCategory is "all", show all items without filtering
    // since the server-side query already handles category filtering correctly
    if (selectedCategory === "all") {
      setItems(allItems);
    } else {
      // Only apply client-side filtering for specific categories
      const filteredItems = allItems.filter(
        (item) => item.category === selectedCategory
      );
      setItems(filteredItems);
    }
  }, [galleries, selectedCategory, convertGalleriesToItems]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreGalleries();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMoreGalleries]);

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

      {/* Update Notification */}
      {updateAvailable && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Galeri baru tersedia!{" "}
                  {updateInfo?.affectedGalleries.length || 0} item telah
                  diperbarui.
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={refreshGalleryData}
                disabled={refreshing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium disabled:opacity-50"
              >
                {refreshing ? "Memuat..." : "Perbarui"}
              </button>
              <button
                onClick={() => setUpdateAvailable(false)}
                className="text-blue-600 hover:text-blue-800 px-2 py-1 text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="break-inside-avoid mb-4">
            <Link href={`/galeri/${item.slug}`} className="block group">
              <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={400}
                  height={(400 * item.height) / item.width}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
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
      {hasMore && (
        <div ref={loadingRef} className="text-center py-8">
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-gray-600">Memuat lebih banyak...</span>
            </div>
          ) : (
            <p className="text-gray-500">Scroll untuk memuat lebih banyak</p>
          )}
        </div>
      )}

      {items.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Tidak ada gambar untuk kategori ini.</p>
        </div>
      )}
    </div>
  );
}
