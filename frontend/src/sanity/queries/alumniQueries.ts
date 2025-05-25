/**
 * Query untuk alumni dari Sanity
 */

// Query untuk mendapatkan semua alumni
export const getAllAlumniQuery = `*[
  _type == "alumni"
  && defined(slug.current)
]|order(yearGraduated desc){
  _id, 
  name, 
  slug,
  yearGraduated,
  major,
  "profileImageUrl": profileImage.asset->url,
  currentJob
}`;

// Query untuk mendapatkan alumni terkemuka/featured
export const getFeaturedAlumniQuery = (limit: number = 4) => `*[
  _type == "alumni"
  && defined(slug.current)
]|order(yearGraduated desc)[0...${limit}]{
  _id, 
  name, 
  slug,
  yearGraduated,
  major,
  "profileImageUrl": profileImage.asset->url,
  currentJob
}`;

// Query untuk mendapatkan detail alumni berdasarkan slug
export const getAlumniBySlugQuery = `*[
  _type == "alumni" 
  && slug.current == $slug
][0]{
  _id,
  name,
  slug,
  yearGraduated,
  major,
  "profileImageUrl": profileImage.asset->url,
  email,
  socialMedia,
  currentJob,
  bio,
  achievements
}`;
