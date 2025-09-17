import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { groq } from "next-sanity";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters from URL
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category") || "";
    const action = searchParams.get("action") || "list"; // 'list', 'count', 'lastUpdate'

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build filter conditions
    let filterConditions = [`_type == "gallery"`];

    if (category && category !== "all") {
      filterConditions.push(`category == "${category}"`);
    }

    // Combine filters into one query string
    const filterQuery = filterConditions.join(" && ");

    // Handle different actions
    switch (action) {
      case "count":
        const countQuery = groq`count(*[${filterQuery}])`;
        const totalItems = await client.fetch(countQuery);
        return NextResponse.json({ count: totalItems });

      case "lastUpdate":
        const lastUpdateQuery = groq`*[_type == "gallery"] | order(_updatedAt desc)[0]._updatedAt`;
        const lastUpdate = await client.fetch(lastUpdateQuery);
        const timestamp = lastUpdate ? new Date(lastUpdate).getTime() : 0;
        return NextResponse.json({ lastUpdate: timestamp });

      case "list":
      default:
        // Query to get galleries with pagination
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
    }
  } catch (error) {
    console.error("Error fetching gallery data:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data galeri" },
      { status: 500 }
    );
  }
}
