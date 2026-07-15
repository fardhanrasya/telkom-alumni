import { groq } from "next-sanity";

export const galleryQuery = groq`
  *[_type == "gallery" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
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
  }
`;

export const galleryBySlugQuery = groq`
  *[_type == "gallery" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
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
  }
`;
