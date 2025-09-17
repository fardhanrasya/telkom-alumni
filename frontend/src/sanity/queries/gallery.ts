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

export const galleryPaginatedQuery = groq`
  *[_type == "gallery" && !(_id in path("drafts.**"))] | order(publishedAt desc) [$start...$end] {
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

export const galleryCountQuery = groq`
  count(*[_type == "gallery" && !(_id in path("drafts.**"))])
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

export const galleryByCategoryQuery = groq`
  *[_type == "gallery" && category == $category && !(_id in path("drafts.**"))] | order(publishedAt desc) [$start...$end] {
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

export const galleryByCategoryCountQuery = groq`
  count(*[_type == "gallery" && category == $category && !(_id in path("drafts.**"))])
`;

export const featuredGalleryQuery = groq`
  *[_type == "gallery" && featured == true && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    _updatedAt,
    _createdAt,
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
