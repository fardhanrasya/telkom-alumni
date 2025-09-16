import { groq } from "next-sanity";

export const galleryQuery = groq`
  *[_type == "gallery"] | order(publishedAt desc) {
    _id,
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

export const galleryPaginatedQuery = groq`
  *[_type == "gallery"] | order(publishedAt desc) [$start...$end] {
    _id,
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

export const galleryCountQuery = groq`
  count(*[_type == "gallery"])
`;

export const galleryBySlugQuery = groq`
  *[_type == "gallery" && slug.current == $slug][0] {
    _id,
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

export const galleryByCategoryQuery = groq`
  *[_type == "gallery" && category == $category] | order(publishedAt desc) [$start...$end] {
    _id,
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

export const galleryByCategoryCountQuery = groq`
  count(*[_type == "gallery" && category == $category])
`;

export const featuredGalleryQuery = groq`
  *[_type == "gallery" && featured == true] | order(publishedAt desc) {
    _id,
    title,
    slug,
    description,
    category,
    publishedAt,
    featured,
    images[0] {
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
