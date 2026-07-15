import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { groq } from "next-sanity";

/**
 * Gallery API Route with Consistent Image Ordering
 *
 * Sorting Algorithm:
 * - Primary: Gallery creation date (newest first)
 * - Secondary: Gallery index in query result (stable order)
 * - Tertiary: Image index within gallery (original order)
 *
 * This ensures consistent image ordering across all pagination requests
 * and prevents images from changing positions when loading more content.
 */

// Utility function to create consistent sort keys
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters from URL
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category") || "";
    const action = searchParams.get("action") || "images"; // 'images', 'galleries', 'count', 'lastUpdate'

    // Build filter conditions
    let filterConditions = [
      `_type == "gallery"`,
      `!(_id in path("drafts.**"))`,
    ];

    if (category && category !== "all") {
      filterConditions.push(`category == "${category}"`);
    }

    // Combine filters into one query string
    const filterQuery = filterConditions.join(" && ");

    // Handle different actions
    switch (action) {
      case "images":
        // Get ALL galleries and flatten to images for proper pagination
        const allGalleriesQuery = groq`*[${filterQuery}] | order(_createdAt desc) {
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

        // Flatten galleries to individual images with unique IDs and stable ordering
        // Using consistent sorting algorithm to prevent image order changes during pagination
        const allImages: any[] = [];
        const seenImageIds = new Set<string>();

        allGalleries.forEach((gallery: any, galleryIndex: number) => {
          gallery.images.forEach((img: any, imageIndex: number) => {
            // Create unique ID using gallery ID, image asset ID, and image index
            // Format: galleryId-assetId-imageIndex (ensures uniqueness and consistency)
            const uniqueId = `${gallery._id}-${img.image.asset._id}-${imageIndex}`;

            // Skip if we've already seen this image asset (prevent duplicates)
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

        // Apply pagination to flattened images
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedImages = allImages.slice(startIndex, endIndex);

        return NextResponse.json({
          images: paginatedImages,
          pagination: {
            totalImages: allImages.length,
            currentPage: page,
            itemsPerPage: limit,
            hasMore: endIndex < allImages.length,
          },
        });

      case "galleries":
        // Original gallery pagination (for backward compatibility)
        const offset = (page - 1) * limit;
        const dataQuery = groq`*[${filterQuery}] | order(_updatedAt desc) [${offset}...${
          offset + limit
        }] {
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

        const galleries = await client.fetch(dataQuery);

        return NextResponse.json({
          galleries,
          pagination: {
            totalItems: galleries.length,
            currentPage: page,
            itemsPerPage: limit,
            hasMore: galleries.length === limit,
          },
        });

      case "count":
        const countQuery = groq`count(*[${filterQuery}])`;
        const totalItems = await client.fetch(countQuery);
        return NextResponse.json({ count: totalItems });

      case "lastUpdate":
        const lastUpdateQuery = groq`*[_type == "gallery" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]._updatedAt`;
        const lastUpdate = await client.fetch(lastUpdateQuery);
        const timestamp = lastUpdate ? new Date(lastUpdate).getTime() : 0;
        return NextResponse.json({ lastUpdate: timestamp });

      default:
        return NextResponse.json(
          { error: "Invalid action parameter" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error fetching gallery data:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data galeri" },
      { status: 500 }
    );
  }
}
