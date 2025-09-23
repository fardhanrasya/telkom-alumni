/**
 * Query untuk acara dari Sanity
 */

// Query untuk mendapatkan semua acara (hanya yang belum berakhir)
export const getAllEventsQuery = `*[
  _type == "event"
  && defined(slug.current)
  && (
    (defined(endDate) && endDate >= now()) || 
    (!defined(endDate) && startDate >= now())
  )
]|order(startDate asc){
  _id, 
  title, 
  slug,
  startDate,
  endDate,
  location,
  isVirtual,
  virtualLink,
  "imageUrl": image.asset->url,
  description
}`;

// Query untuk mendapatkan acara yang akan datang (belum berakhir)
export const getUpcomingEventsQuery = (limit: number = 3) => `*[
  _type == "event"
  && defined(slug.current)
  && (
    (defined(endDate) && endDate >= now()) || 
    (!defined(endDate) && startDate >= now())
  )
]|order(startDate asc)[0...${limit}]{
  _id, 
  title, 
  slug,
  startDate,
  location,
  isVirtual,
  "imageUrl": image.asset->url
}`;

// Query untuk mendapatkan detail acara berdasarkan slug
export const getEventBySlugQuery = `*[
  _type == "event" 
  && slug.current == $slug
][0]{
  _id,
  title,
  slug,
  startDate,
  endDate,
  location,
  isVirtual,
  virtualLink,
  "imageUrl": image.asset->url,
  description,
  speakers,
  registrationLink
}`;
