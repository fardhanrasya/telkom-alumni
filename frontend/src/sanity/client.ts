import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  // Tambahkan token untuk akses API
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  // Pastikan untuk menambahkan `stega` untuk menghindari masalah CORS di development
  stega: {
    enabled: false, // Nonaktifkan stega untuk development
    studioUrl: '/studio'
  },
  // Nonaktifkan CORS warning di development
  ignoreBrowserTokenWarning: true
});