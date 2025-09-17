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
  _updatedAt?: string;
  _createdAt?: string;
}

export async function getAllGalleries(): Promise<Gallery[]> {
  return await client.fetch(galleryQuery);
}

export async function getGalleryBySlug(slug: string): Promise<Gallery | null> {
  return await client.fetch(galleryBySlugQuery, { slug });
}

export async function getGalleriesByCategory(
  category: string
): Promise<Gallery[]> {
  return await client.fetch(galleryByCategoryQuery, { category });
}

export async function getFeaturedGalleries(): Promise<Gallery[]> {
  return await client.fetch(featuredGalleryQuery);
}

export async function getGalleriesPaginated(
  start: number = 0,
  end: number = 11
): Promise<Gallery[]> {
  return await client.fetch(galleryPaginatedQuery, { start, end });
}

export async function getGalleriesCount(): Promise<number> {
  return await client.fetch(galleryCountQuery);
}

export async function getGalleriesByCategoryPaginated(
  category: string,
  start: number = 0,
  end: number = 11
): Promise<Gallery[]> {
  return await client.fetch(galleryByCategoryQuery, { category, start, end });
}

export async function getGalleriesByCategoryCount(
  category: string
): Promise<number> {
  return await client.fetch(galleryByCategoryCountQuery, { category });
}

// Timestamp tracking functions
export async function getLastUpdateTimestamp(): Promise<number> {
  const query = `*[_type == "gallery"] | order(_updatedAt desc)[0]._updatedAt`;
  const lastUpdate = await client.fetch(query);
  return lastUpdate ? new Date(lastUpdate).getTime() : 0;
}

export async function checkForUpdates(lastKnown: number): Promise<boolean> {
  const latestTimestamp = await getLastUpdateTimestamp();
  return latestTimestamp > lastKnown;
}

export function compareTimestamps(
  timestamp1: number,
  timestamp2: number
): number {
  return timestamp1 - timestamp2;
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

// Cache invalidation methods
let cacheStore: Map<string, any> = new Map();

export function invalidateCache(galleryId?: string): void {
  if (galleryId) {
    // Invalidate specific gallery cache
    cacheStore.delete(`gallery-${galleryId}`);
    cacheStore.delete(`gallery-slug-${galleryId}`);
  } else {
    // Invalidate all gallery cache
    const keysToDelete = Array.from(cacheStore.keys()).filter(
      (key) => key.startsWith("gallery-") || key.startsWith("galleries-")
    );
    keysToDelete.forEach((key) => cacheStore.delete(key));
  }
}

export function invalidateCacheByCategory(category: string): void {
  // Invalidate category-specific cache
  cacheStore.delete(`galleries-category-${category}`);
  cacheStore.delete(`galleries-category-count-${category}`);
  // Also invalidate main gallery cache as it includes all categories
  cacheStore.delete("galleries-all");
  cacheStore.delete("galleries-paginated");
}

export function invalidateBulkCache(galleryIds: string[]): void {
  galleryIds.forEach((id) => invalidateCache(id));
  // Also invalidate aggregate caches
  cacheStore.delete("galleries-all");
  cacheStore.delete("galleries-paginated");
  cacheStore.delete("galleries-featured");
}

export function clearAllCache(): void {
  cacheStore.clear();
}

// Enhanced update detection functionality
export interface UpdateInfo {
  hasUpdates: boolean;
  lastUpdate: number;
  affectedGalleries: string[];
  updateType: "create" | "update" | "delete" | "multiple";
}

export async function checkForUpdatesDetailed(
  lastKnown: number
): Promise<UpdateInfo> {
  const query = `*[_type == "gallery" && _updatedAt > $lastKnown] {
    _id,
    _updatedAt,
    slug,
    title
  }`;

  const updatedGalleries = await client.fetch(query, {
    lastKnown: new Date(lastKnown).toISOString(),
  });

  const latestTimestamp = await getLastUpdateTimestamp();

  return {
    hasUpdates: updatedGalleries.length > 0,
    lastUpdate: latestTimestamp,
    affectedGalleries: updatedGalleries.map((g: any) => g._id),
    updateType: updatedGalleries.length === 1 ? "update" : "multiple",
  };
}

export async function getUpdatesSince(timestamp: number): Promise<Gallery[]> {
  const query = `*[_type == "gallery" && _updatedAt > $timestamp] | order(_updatedAt desc) {
    _id,
    _updatedAt,
    _createdAt,
    title,
    slug,
    description,
    category,
    publishedAt,
    featured,
    images[] {
      image {
        asset-> {
          _id,
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      },
      alt,
      caption
    }
  }`;

  return await client.fetch(query, {
    timestamp: new Date(timestamp).toISOString(),
  });
}

export function shouldRefreshData(
  lastFetch: number,
  maxAge: number = 30000
): boolean {
  return Date.now() - lastFetch > maxAge;
}
