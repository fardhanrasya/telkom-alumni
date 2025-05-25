import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import Image from "next/image";
import Link from "next/link";
import { getAllPostsQuery } from "@/sanity/queries";
import { extractPreviewText } from "@/sanity/utils";

// Opsi untuk revalidasi data

const options = { next: { revalidate: 30 } };

// Format tanggal untuk tampilan yang lebih baik
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export default async function BeritaPage() {
  // Mengambil data berita dari Sanity menggunakan query modular
  const posts = await client.fetch<SanityDocument[]>(getAllPostsQuery, {}, options);

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Berita Terbaru</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Temukan berita dan informasi terbaru seputar kegiatan alumni SMK Telkom Jakarta
          </p>
        </div>

        {/* Berita Utama */}
        {posts && posts.length > 0 && (
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0 md:w-1/2 relative h-64 md:h-auto">
                  {posts[0].imageUrl ? (
                    <Image
                      src={posts[0].imageUrl}
                      alt={posts[0].title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                      <span className="text-gray-500">Tidak ada gambar</span>
                    </div>
                  )}
                </div>
                <div className="p-8 md:p-10 md:w-1/2 flex flex-col justify-between">
                  <div>
                    <div className="text-sm text-primary font-semibold mb-2">
                      {formatDate(posts[0].publishedAt)}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                      {posts[0].title}
                    </h2>
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {/* Ambil teks dari blok konten pertama jika ada */}
                      {extractPreviewText(posts[0].body) || 'Baca selengkapnya...'}
                    </p>
                  </div>
                  <Link
                    href={`/${posts[0].slug.current}`}
                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-700 transition-colors duration-200"
                  >
                    Baca Selengkapnya
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid Berita */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts && posts.length > 1 && posts.slice(1).map((post) => (
            <Link 
              key={post._id} 
              href={`/${post.slug.current}`} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200"
            >
              <div className="relative h-48 w-full">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                    <span className="text-gray-500">Tidak ada gambar</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="text-sm text-primary font-medium mb-2">
                  {formatDate(post.publishedAt)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.body?.[0]?.children?.[0]?.text || 'Baca selengkapnya...'}
                </p>
                <div className="text-primary font-medium hover:underline">
                  Baca Selengkapnya
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Jika tidak ada berita */}
        {(!posts || posts.length === 0) && (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <h3 className="text-2xl font-medium text-gray-900 mb-4">
              Belum ada berita tersedia
            </h3>
            <p className="text-gray-600">
              Silahkan kembali lagi nanti untuk melihat berita terbaru
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
