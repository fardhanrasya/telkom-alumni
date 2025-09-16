/**
 * Query untuk berita/post dari Sanity
 */

// Query untuk mendapatkan semua berita dengan pagination
export const getAllPostsQuery = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc){
  _id, 
  title, 
  slug,
  publishedAt,
  "imageUrl": image.asset->url,
  body[0]{
    children[0]{
      text
    }
  }
}`;

// Query untuk mendapatkan beberapa berita terbaru
export const getRecentPostsQuery = (limit: number = 3) => `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...${limit}]{
  _id, 
  title, 
  slug,
  publishedAt,
  "imageUrl": image.asset->url,
  body[0]{
    children[0]{
      text
    }
  }
}`;

// Query untuk mendapatkan detail berita berdasarkan slug
export const getPostBySlugQuery = `*[
  _type == "post" 
  && slug.current == $slug
][0]{
  _id,
  title,
  slug,
  publishedAt,
  "imageUrl": image.asset->url,
  body
}`;

// Query untuk mendapatkan berita terkait (selain berita dengan slug tertentu)
export const getRelatedPostsQuery = `*[
  _type == "post" 
  && slug.current != $slug
][0...3]{
  _id, 
  title, 
  slug, 
  publishedAt, 
  "imageUrl": image.asset->url
}`;
