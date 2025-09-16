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
