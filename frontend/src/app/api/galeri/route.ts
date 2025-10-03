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

/**
 * @swagger
 * /api/galeri:
 *   get:
 *     summary: Retrieve gallery data based on specified action.
 *     description: This endpoint provides various ways to fetch gallery-related data, including paginated images, paginated galleries, total counts, and last update timestamps.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination, applicable for 'images' and 'galleries' actions.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page, applicable for 'images' and 'galleries' actions.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter galleries or images by category.
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [images, galleries, count, lastUpdate]
 *           default: images
 *         description: Specifies the type of data to retrieve.
 *     responses:
 *       200:
 *         description: Successful response based on the 'action' parameter.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/GalleryImagesResponse'
 *                 - $ref: '#/components/schemas/GalleryGalleriesResponse'
 *                 - $ref: '#/components/schemas/GalleryCountResponse'
 *                 - $ref: '#/components/schemas/GalleryLastUpdateResponse'
 *       400:
 *         description: Invalid action parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid action parameter
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Terjadi kesalahan saat mengambil data galeri
 * components:
 *   schemas:
 *     GalleryImage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique ID for the image.
 *         image:
 *           type: object
 *           properties:
 *             image:
 *               type: object
 *               properties:
 *                 asset:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     url:
 *                       type: string
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         dimensions:
 *                           type: object
 *                           properties:
 *                             width:
 *                               type: integer
 *                             height:
 *                               type: integer
 *             alt:
 *               type: string
 *             caption:
 *               type: string
 *         gallery:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             title:
 *               type: string
 *             slug:
 *               type: object
 *               properties:
 *                 current:
 *                   type: string
 *             category:
 *               type: string
 *             publishedAt:
 *               type: string
 *               format: date-time
 *             _createdAt:
 *               type: string
 *               format: date-time
 *         sortKey:
 *           type: string
 *     GalleryImagesResponse:
 *       type: object
 *       properties:
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/GalleryImage'
 *         pagination:
 *           type: object
 *           properties:
 *             totalImages:
 *               type: integer
 *             currentPage:
 *               type: integer
 *             itemsPerPage:
 *               type: integer
 *             hasMore:
 *               type: boolean
 *     GalleryItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         slug:
 *           type: object
 *           properties:
 *             current:
 *               type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         publishedAt:
 *           type: string
 *           format: date-time
 *         featured:
 *           type: boolean
 *         _updatedAt:
 *           type: string
 *           format: date-time
 *         _createdAt:
 *           type: string
 *           format: date-time
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               image:
 *                 type: object
 *                 properties:
 *                   asset:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       url:
 *                         type: string
 *                       metadata:
 *                         type: object
 *                         properties:
 *                           dimensions:
 *                             type: object
 *                             properties:
 *                               width:
 *                                 type: integer
 *                               height:
 *                                 type: integer
 *               alt:
 *                 type: string
 *               caption:
 *                 type: string
 *     GalleryGalleriesResponse:
 *       type: object
 *       properties:
 *         galleries:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/GalleryItem'
 *         pagination:
 *           type: object
 *           properties:
 *             totalItems:
 *               type: integer
 *             currentPage:
 *               type: integer
 *             itemsPerPage:
 *               type: integer
 *             hasMore:
 *               type: boolean
 *     GalleryCountResponse:
 *       type: object
 *       properties:
 *         count:
 *           type: integer
 *     GalleryLastUpdateResponse:
 *       type: object
 *       properties:
 *         lastUpdate:
 *           type: integer
 */
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
