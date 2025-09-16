/**
 * Query untuk lowongan kerja dari Sanity
 */

// Query untuk mendapatkan semua lowongan kerja
export const getAllJobsQuery = `*[
  _type == "jobPosting"
  && defined(slug.current)
]|order(publishedAt desc){
  _id, 
  title, 
  slug,
  publishedAt,
  company,
  jobType,
  workplaceType,
  expiresAt
}`;

// Query untuk mendapatkan lowongan kerja terbaru
export const getRecentJobsQuery = (limit: number = 3) => `*[
  _type == "jobPosting"
  && defined(slug.current)
]|order(publishedAt desc)[0...${limit}]{
  _id, 
  title, 
  slug,
  publishedAt,
  company,
  jobType,
  workplaceType
}`;

// Query untuk mendapatkan detail lowongan kerja berdasarkan slug
export const getJobBySlugQuery = `*[
  _type == "jobPosting" 
  && slug.current == $slug
][0]{
  _id,
  title,
  slug,
  company,
  publishedAt,
  expiresAt,
  jobType,
  workplaceType,
  salaryRange,
  description,
  requirements,
  responsibilities,
  applyLink,
  contactEmail,
  postedBy->{
    _id,
    name,
    "profileImageUrl": profileImage.asset->url
  }
}`;
