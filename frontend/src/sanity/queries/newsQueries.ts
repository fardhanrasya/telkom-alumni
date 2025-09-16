/**
 * Query untuk berita dari Sanity
 */

// Query untuk mendapatkan semua berita dengan pagination
export const getAllNewsQuery = `*[
  _type == "NewsPost"
  && defined(slug.current)
]|order(publishedAt desc){
  _id, 
  title, 
  subtitle,
  slug,
  publishedAt,
  updatedAt,
  excerpt,
  featured,
  status,
  "mainImageUrl": mainImage.asset->url,
  "authorName": author->name,
  "authorImage": author->image.asset->url,
  "tags": tags[]->name
}`;

// Query untuk mendapatkan beberapa berita terbaru
export const getRecentNewsQuery = (limit: number = 3) => `*[
  _type == "NewsPost"
  && defined(slug.current)
  && status == "published"
]|order(publishedAt desc)[0...${limit}]{
  _id, 
  title, 
  subtitle,
  slug,
  publishedAt,
  excerpt,
  "mainImageUrl": mainImage.asset->url,
  "authorName": author->name,
  "authorImage": author->image.asset->url
}`;

// Query untuk mendapatkan berita unggulan
export const getFeaturedNewsQuery = (limit: number = 5) => `*[
  _type == "NewsPost"
  && defined(slug.current)
  && status == "published"
  && featured == true
]|order(publishedAt desc)[0...${limit}]{
  _id, 
  title, 
  subtitle,
  slug,
  publishedAt,
  excerpt,
  "mainImageUrl": mainImage.asset->url,
  "authorName": author->name,
  "authorImage": author->image.asset->url
}`;

// Query untuk mendapatkan detail berita berdasarkan slug
export const getNewsBySlugQuery = `*[
  _type == "NewsPost" 
  && slug.current == $slug
][0]{
  _id,
  title,
  subtitle,
  slug,
  publishedAt,
  updatedAt,
  excerpt,
  body,
  "mainImageUrl": mainImage.asset->url,
  "author": author->{
    name,
    "image": image.asset->url,
    position,
    bio
  },
  "tags": tags[]->{ name, slug }
}`;

// Query untuk mendapatkan berita terkait berdasarkan tag
export const getRelatedNewsQuery = `*[
  _type == "NewsPost" 
  && slug.current != $slug
  && count((tags[]->_id)[@ in *[_type=="NewsPost" && slug.current==$slug][0].tags[]->_id]) > 0
  && status == "published"
]|order(publishedAt desc)[0...3]{
  _id, 
  title, 
  slug, 
  publishedAt, 
  "mainImageUrl": mainImage.asset->url,
  "authorName": author->name
}`;

// Query untuk mendapatkan berita terbaru (jika tidak ada berita terkait)
export const getLatestNewsQuery = `*[
  _type == "NewsPost" 
  && slug.current != $slug
  && status == "published"
]|order(publishedAt desc)[0...3]{
  _id, 
  title, 
  slug, 
  publishedAt, 
  "mainImageUrl": mainImage.asset->url,
  "authorName": author->name
}`;

// Query untuk mendapatkan semua tag berita
export const getAllNewsTagsQuery = `*[
  _type == "NewsTag"
]|order(name asc){
  _id,
  name,
  slug
}`;

// Query untuk mendapatkan tahun-tahun publikasi berita
export const getNewsYearsQuery = `array::unique(*[
  _type == "NewsPost"
  && defined(publishedAt)
]|order(publishedAt desc).publishedAt[0:10] | dateTime(^).year)`;
