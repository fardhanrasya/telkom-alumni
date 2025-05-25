import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "./client";

const { projectId, dataset } = client.config();

/**
 * Fungsi untuk menghasilkan URL gambar dari referensi asset Sanity
 */
export const urlFor = (source: SanityImageSource) => {
  if (!source) return null;
  
  return projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;
};

/**
 * Fungsi untuk menghasilkan URL gambar dari referensi asset Sanity
 * dengan memformat string referensi
 */
export const getImageUrl = (ref: string) => {
  if (!ref) return null;
  
  // Format: image-44e535b4fa82853218e9407876046fef7cdedb69-640x429-jpg
  const assetId = ref
    .replace('image-', '')
    .replace('-jpg', '.jpg')
    .replace('-png', '.png')
    .replace('-webp', '.webp');
    
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}`;
};

/**
 * Fungsi helper untuk mengekstrak teks preview dari blok konten
 */
export const extractPreviewText = (body: any, maxLength: number = 150) => {
  if (!body || !Array.isArray(body) || body.length === 0) {
    return '';
  }
  
  // Coba ambil teks dari blok pertama
  const firstBlock = body[0];
  if (firstBlock && firstBlock.children && Array.isArray(firstBlock.children)) {
    const text = firstBlock.children
      .filter((child: any) => child.text)
      .map((child: any) => child.text)
      .join(' ');
      
    return text.length > maxLength 
      ? `${text.substring(0, maxLength)}...` 
      : text;
  }
  
  return '';
};
