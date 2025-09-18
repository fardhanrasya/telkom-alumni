import { client } from "../client";
import { galleryQuery, galleryBySlugQuery } from "../queries/gallery";

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

// Timestamp tracking functions
export async function getLastUpdateTimestamp(): Promise<number> {
  // During build time or server-side rendering, use direct client calls
  if (typeof window === "undefined") {
    const query = `*[_type == "gallery" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]._updatedAt`;
    const lastUpdate = await client.fetch(query);
    return lastUpdate ? new Date(lastUpdate).getTime() : 0;
  }

  // Client-side: use API route
  try {
    const response = await fetch("/api/galeri?action=lastUpdate");

    if (!response.ok) {
      throw new Error("Failed to fetch last update timestamp");
    }

    const data = await response.json();
    return data.lastUpdate || 0;
  } catch (error) {
    console.error("Error fetching last update timestamp:", error);
    // Fallback to direct client call if API fails
    const query = `*[_type == "gallery" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]._updatedAt`;
    const lastUpdate = await client.fetch(query);
    return lastUpdate ? new Date(lastUpdate).getTime() : 0;
  }
}

export async function checkForUpdates(lastKnown: number): Promise<boolean> {
  const latestTimestamp = await getLastUpdateTimestamp();
  return latestTimestamp > lastKnown;
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
  const query = `*[_type == "gallery" && !(_id in path("drafts.**")) && _updatedAt > $lastKnown] {
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
