"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Gallery,
  GalleryImage,
  getGalleriesPaginated,
  getGalleriesByCategoryPaginated,
} from "@/sanity/services/gallery";
import { urlFor } from "@/sanity/utils";
import styles from "./MasonryGallery.module.css";

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
  aspectRatio: number;
  gridArea?: string;
}

interface LayoutSlot {
  id: string;
  aspectRatio: number;
  gridArea: string;
  label: string;
}

// Define the layout pattern based on the image
const LAYOUT_PATTERN: LayoutSlot[] = [
  {
    id: "large-landscape",
    aspectRatio: 20 / 24,
    gridArea: "1 / 1 / 3 / 3",
    label: "20x24",
  },
  {
    id: "medium-landscape",
    aspectRatio: 21 / 11,
    gridArea: "1 / 3 / 2 / 5",
    label: "21x11",
  },
  {
    id: "tall-portrait",
    aspectRatio: 11 / 25,
    gridArea: "1 / 5 / 4 / 6",
    label: "11x25",
  },
  {
    id: "small-square-1",
    aspectRatio: 8 / 10,
    gridArea: "2 / 3 / 3 / 4",
    label: "8x10",
  },
  {
    id: "small-square-2",
    aspectRatio: 8 / 10,
    gridArea: "2 / 4 / 3 / 5",
    label: "8x10",
  },
  {
    id: "medium-portrait-1",
    aspectRatio: 13 / 19,
    gridArea: "3 / 1 / 5 / 2",
    label: "13x19",
  },
  {
    id: "small-square-3",
    aspectRatio: 8 / 10,
    gridArea: "3 / 2 / 4 / 3",
    label: "8x10",
  },
  {
    id: "wide-landscape",
    aspectRatio: 21 / 19,
    gridArea: "3 / 3 / 4 / 5",
    label: "21x19",
  },
  {
    id: "medium-portrait-2",
    aspectRatio: 11 / 14,
    gridArea: "4 / 5 / 6 / 6",
    label: "11x14",
  },
  {
    id: "small-square-4",
    aspectRatio: 10 / 10,
    gridArea: "4 / 2 / 5 / 3",
    label: "10x10",
  },
];

const ITEMS_PER_PAGE = 12;

export default function MasonryGallery({
  initialGalleries,
  initialHasMore,
}: MasonryGalleryProps) {
  const [galleries, setGalleries] = useState<Gallery[]>(initialGalleries);
  const [items, setItems] = useState<MasonryItem[]>([]);
  const [layoutGrids, setLayoutGrids] = useState<MasonryItem[][]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
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

  const convertGalleriesToItems = useCallback(
    (galleries: Gallery[]): MasonryItem[] => {
      const allItems: MasonryItem[] = [];

      galleries.forEach((gallery) => {
        gallery.images.forEach((img: GalleryImage, index: number) => {
          const width = img.image.asset.metadata.dimensions.width;
          const height = img.image.asset.metadata.dimensions.height;
          const aspectRatio = width / height;

          allItems.push({
            id: `${gallery._id}-${index}`,
            src: urlFor(img.image.asset)?.width(400).quality(80).url() || "",
            alt: img.alt,
            width,
            height,
            title: gallery.title,
            slug: gallery.slug.current,
            category: gallery.category,
            aspectRatio,
          });
        });
      });

      return allItems;
    },
    []
  );

  // Function to find the best matching layout slot for an image
  const findBestSlot = useCallback((aspectRatio: number): LayoutSlot => {
    let bestSlot = LAYOUT_PATTERN[0];
    let smallestDifference = Math.abs(aspectRatio - bestSlot.aspectRatio);

    LAYOUT_PATTERN.forEach((slot) => {
      const difference = Math.abs(aspectRatio - slot.aspectRatio);
      if (difference < smallestDifference) {
        smallestDifference = difference;
        bestSlot = slot;
      }
    });

    return bestSlot;
  }, []);

  // Group items into layout grids with sequential placement
  const createLayoutGrids = useCallback((items: MasonryItem[]) => {
    if (items.length === 0) return [];

    const grids: MasonryItem[][] = [];
    let currentGrid: MasonryItem[] = [];
    let slotIndex = 0;

    items.forEach((item, itemIndex) => {
      // For partial grids, ensure we show images in sequence
      const currentSlot = LAYOUT_PATTERN[slotIndex % LAYOUT_PATTERN.length];

      // Assign the current slot to the item
      currentGrid.push({ ...item, gridArea: currentSlot.gridArea });
      slotIndex++;

      // Start a new grid when we've used all slots or reached the pattern limit
      if (
        slotIndex % LAYOUT_PATTERN.length === 0 ||
        itemIndex === items.length - 1
      ) {
        grids.push([...currentGrid]);
        currentGrid = [];

        // Only reset slot index if we completed a full pattern
        if (slotIndex % LAYOUT_PATTERN.length === 0) {
          slotIndex = 0;
        }
      }
    });

    return grids;
  }, []);

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

  // Convert galleries to items when galleries change
  useEffect(() => {
    const allItems = convertGalleriesToItems(galleries);
    const filteredItems =
      selectedCategory === "all"
        ? allItems
        : allItems.filter((item) => item.category === selectedCategory);

    setItems(filteredItems);
    setLayoutGrids(createLayoutGrids(filteredItems));
  }, [galleries, selectedCategory, convertGalleriesToItems, createLayoutGrids]);

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
            type="button"
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

      {/* Layout Grid */}
      <div className="space-y-8">
        {layoutGrids.map((grid, gridIndex) => (
          <div key={`grid-${gridIndex}`} className={styles.layoutGrid}>
            {grid.map((item) => (
              <div
                key={item.id}
                className={styles.gridItem}
                style={{ gridArea: item.gridArea }}
              >
                <Link
                  href={`/galeri/${item.slug}`}
                  className="block group h-full"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                      <div className="p-2 md:p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-semibold text-xs md:text-sm line-clamp-2">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
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
