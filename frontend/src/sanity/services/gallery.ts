import { client } from "../client";
import {
  galleryQuery,
  galleryPaginatedQuery,
  galleryCountQuery,
  galleryBySlugQuery,
  galleryByCategoryQuery,
  galleryByCategoryCountQuery,
  featuredGalleryQuery,
} from "../queries/gallery";

// Cache configuration
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes in milliseconds

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Cache storage
const cache = new Map<string, CacheEntry<any>>();

// Cache helper functions
function getCacheKey(queryName: string, params?: Record<string, any>): string {
  return params ? `${queryName}_${JSON.stringify(params)}` : queryName;
}

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export interface GalleryImage {
  image: {
    asset: {
      _id: string;
      url: string;
      metadata: {
        dimensions: {
          width: number;
          height: number;
        };
      };
    };
  };
  alt: string;
  caption?: string;
}

export interface Gallery {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  category?: string;
  publishedAt: string;
  featured: boolean;
  images: GalleryImage[];
}

export async function getAllGalleries(): Promise<Gallery[]> {
  const cacheKey = getCacheKey("getAllGalleries");
  const cached = getFromCache<Gallery[]>(cacheKey);

  if (cached) return cached;

  const data = await client.fetch(galleryQuery);
  setCache(cacheKey, data);
  return data;
}

export async function getGalleryBySlug(slug: string): Promise<Gallery | null> {
  const cacheKey = getCacheKey("getGalleryBySlug", { slug });
  const cached = getFromCache<Gallery | null>(cacheKey);

  if (cached !== null) return cached;

  const data = await client.fetch(galleryBySlugQuery, { slug });
  setCache(cacheKey, data);
  return data;
}

export async function getGalleriesByCategory(
  category: string
): Promise<Gallery[]> {
  const cacheKey = getCacheKey("getGalleriesByCategory", { category });
  const cached = getFromCache<Gallery[]>(cacheKey);

  if (cached) return cached;

  const data = await client.fetch(galleryByCategoryQuery, { category });
  setCache(cacheKey, data);
  return data;
}

export async function getFeaturedGalleries(): Promise<Gallery[]> {
  const cacheKey = getCacheKey("getFeaturedGalleries");
  const cached = getFromCache<Gallery[]>(cacheKey);

  if (cached) return cached;

  const data = await client.fetch(featuredGalleryQuery);
  setCache(cacheKey, data);
  return data;
}

export async function getGalleriesPaginated(
  start: number = 0,
  end: number = 11
): Promise<Gallery[]> {
  const cacheKey = getCacheKey("getGalleriesPaginated", { start, end });
  const cached = getFromCache<Gallery[]>(cacheKey);

  if (cached) return cached;

  const data = await client.fetch(galleryPaginatedQuery, { start, end });
  setCache(cacheKey, data);
  return data;
}

export async function getGalleriesCount(): Promise<number> {
  const cacheKey = getCacheKey("getGalleriesCount");
  const cached = getFromCache<number>(cacheKey);

  if (cached !== null) return cached;

  const data = await client.fetch(galleryCountQuery);
  setCache(cacheKey, data);
  return data;
}

export async function getGalleriesByCategoryPaginated(
  category: string,
  start: number = 0,
  end: number = 11
): Promise<Gallery[]> {
  const cacheKey = getCacheKey("getGalleriesByCategoryPaginated", {
    category,
    start,
    end,
  });
  const cached = getFromCache<Gallery[]>(cacheKey);

  if (cached) return cached;

  const data = await client.fetch(galleryByCategoryQuery, {
    category,
    start,
    end,
  });
  setCache(cacheKey, data);
  return data;
}

export async function getGalleriesByCategoryCount(
  category: string
): Promise<number> {
  const cacheKey = getCacheKey("getGalleriesByCategoryCount", { category });
  const cached = getFromCache<number>(cacheKey);

  if (cached !== null) return cached;

  const data = await client.fetch(galleryByCategoryCountQuery, { category });
  setCache(cacheKey, data);
  return data;
}
