import { client } from "@/sanity/client";
import { groq } from "next-sanity";
import MasonryGallery from "@/components/MasonryGallery";

// Utility function to create consistent sort keys (same as API route)
function createSortKey(
  galleryCreatedAt: string,
  galleryIndex: number,
  imageIndex: number
): string {
  const galleryTimestamp = new Date(galleryCreatedAt).getTime();
  // Invert timestamp for descending order (newest galleries first)
  const invertedTimestamp = 999999999999999 - galleryTimestamp;
  return `${invertedTimestamp.toString().padStart(15, "0")}-${galleryIndex
    .toString()
    .padStart(4, "0")}-${imageIndex.toString().padStart(3, "0")}`;
}

// Server-side function to get initial images with same logic as API
async function getInitialImages(limit: number = 10) {
  const allGalleriesQuery = groq`*[_type == "gallery" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
    _id,
    title,
    slug,
    description,
    category,
    publishedAt,
    featured,
    _updatedAt,
    _createdAt,
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

  const allGalleries = await client.fetch(allGalleriesQuery);

  // Flatten galleries to individual images with same deduplication logic as API
  // Using consistent sorting algorithm to prevent image order changes during pagination
  const allImages: any[] = [];
  const seenImageIds = new Set<string>();

  allGalleries.forEach((gallery: any, galleryIndex: number) => {
    gallery.images.forEach((img: any, imageIndex: number) => {
      // Create unique ID using gallery ID, image asset ID, and image index
      // Format: galleryId-assetId-imageIndex (ensures uniqueness and consistency)
      const uniqueId = `${gallery._id}-${img.image.asset._id}-${imageIndex}`;

      if (!seenImageIds.has(img.image.asset._id)) {
        seenImageIds.add(img.image.asset._id);

        // Create stable sort key using utility function
        // This ensures consistent ordering across all requests and prevents image shuffling
        const sortKey = createSortKey(
          gallery._createdAt,
          galleryIndex,
          imageIndex
        );

        allImages.push({
          id: uniqueId,
          image: img,
          gallery: {
            _id: gallery._id,
            title: gallery.title,
            slug: gallery.slug,
            category: gallery.category,
            publishedAt: gallery.publishedAt,
            _createdAt: gallery._createdAt,
          },
          sortKey: sortKey,
        });
      }
    });
  });

  // Sort all images by stable sort key to ensure consistent ordering
  allImages.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  // Return first batch and pagination info
  const firstBatch = allImages.slice(0, limit);
  const hasMore = allImages.length > limit;

  return {
    images: firstBatch,
    hasMore,
    totalImages: allImages.length,
  };
}

const ITEMS_PER_PAGE = 10;

// ISR configuration
export const revalidate = 3600; // Revalidate setiap 1 jam

export default async function GaleriPage() {
  // Get initial images server-side with same logic as API
  const {
    images: initialImages,
    hasMore,
    totalImages,
  } = await getInitialImages(ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Galeri SMK Telkom Jakarta
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Dokumentasi kegiatan, prestasi siswa, dan fasilitas sekolah
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <MasonryGallery
            initialImages={initialImages}
            initialHasMore={hasMore}
            initialTotalImages={totalImages}
            initialCurrentPage={1}
          />
        </div>
      </section>
    </div>
  );
}
