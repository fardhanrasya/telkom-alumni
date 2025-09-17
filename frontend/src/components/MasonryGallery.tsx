"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Gallery,
  GalleryImage,
  getAllGalleries,
} from "@/sanity/services/gallery";
import { urlFor } from "@/sanity/utils";

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

const ITEMS_PER_PAGE = 10;

export default function MasonryGallery({
  initialGalleries,
  initialHasMore,
}: MasonryGalleryProps) {
  const [allItems, setAllItems] = useState<MasonryItem[]>([]);
  const [displayedItems, setDisplayedItems] = useState<MasonryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const categories = [
    { value: "all", label: "Semua" },
    { value: "kegiatan-sekolah", label: "Kegiatan Sekolah" },
    { value: "prestasi-siswa", label: "Prestasi Siswa" },
    { value: "fasilitas", label: "Fasilitas" },
    { value: "event", label: "Event" },
    { value: "lainnya", label: "Lainnya" },
  ];

  // Convert galleries to items on initial load
  const convertGalleriesToItems = useCallback(
    (galleries: Gallery[]): MasonryItem[] => {
      const allItems: MasonryItem[] = [];

      galleries.forEach((gallery) => {
        gallery.images.forEach((img: GalleryImage, index: number) => {
          allItems.push({
            id: `${gallery._id}-${index}`,
            src: urlFor(img.image.asset)?.width(600).quality(100).url() || "",
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

  // Load all galleries and convert to items on mount
  useEffect(() => {
    const loadAllImages = async () => {
      setLoading(true);
      try {
        const allGalleries = await getAllGalleries();
        const items = convertGalleriesToItems(allGalleries);
        setAllItems(items);

        // Show first batch of items
        const firstBatch = items.slice(0, ITEMS_PER_PAGE);
        setDisplayedItems(firstBatch);
        setCurrentImageIndex(ITEMS_PER_PAGE);
        setHasMore(items.length > ITEMS_PER_PAGE);
      } catch (error) {
        console.error("Error loading galleries:", error);
        setError("Gagal memuat galeri");
      } finally {
        setLoading(false);
      }
    };

    loadAllImages();
  }, [convertGalleriesToItems]);

  // Load more images (pagination at image level)
  const loadMoreImages = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    const filteredItems =
      selectedCategory === "all"
        ? allItems
        : allItems.filter((item) => item.category === selectedCategory);

    const nextBatch = filteredItems.slice(
      currentImageIndex,
      currentImageIndex + ITEMS_PER_PAGE
    );

    if (nextBatch.length > 0) {
      setDisplayedItems((prev) => [...prev, ...nextBatch]);
      setCurrentImageIndex((prev) => prev + ITEMS_PER_PAGE);
    }

    if (currentImageIndex + ITEMS_PER_PAGE >= filteredItems.length) {
      setHasMore(false);
    }

    setLoading(false);
  }, [allItems, selectedCategory, currentImageIndex, loading, hasMore]);

  // Handle category change
  const handleCategoryChange = useCallback(
    (category: string) => {
      setSelectedCategory(category);

      const filteredItems =
        category === "all"
          ? allItems
          : allItems.filter((item) => item.category === category);

      // Reset displayed items to first batch of filtered items
      const firstBatch = filteredItems.slice(0, ITEMS_PER_PAGE);
      setDisplayedItems(firstBatch);
      setCurrentImageIndex(ITEMS_PER_PAGE);
      setHasMore(filteredItems.length > ITEMS_PER_PAGE);
    },
    [allItems]
  );

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreImages();
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
  }, [hasMore, loading, loadMoreImages]);

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
              window.location.reload();
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

      {displayedItems.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Tidak ada gambar untuk kategori ini.</p>
        </div>
      )}
    </div>
  );
}
