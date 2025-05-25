import { PortableText, type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";
import { getPostBySlugQuery, getRelatedPostsQuery } from "@/sanity/queries";
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

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await client.fetch<SanityDocument>(getPostBySlugQuery, await params, options);
  const relatedPosts = await client.fetch<SanityDocument[]>(getRelatedPostsQuery, await params, options);

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Navigasi kembali */}
        <div className="mb-8">
          <Link 
            href="/berita" 
            className="inline-flex items-center text-primary hover:text-primary-700 font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Kembali ke Berita
          </Link>
        </div>

        {/* Header Artikel */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-12">
          <div className="p-8 sm:p-10">
            <div className="mb-6">
              <span className="inline-block bg-primary-50 text-primary rounded-full px-3 py-1 text-sm font-semibold mb-4">
                {formatDate(post.publishedAt)}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                {post.title}
              </h1>
            </div>
            
            {/* Gambar Artikel */}
            {post.imageUrl && (
              <div className="relative h-64 sm:h-96 w-full mb-10 rounded-xl overflow-hidden">
                <Image 
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            
            {/* Konten Artikel */}
            <article className="prose prose-lg max-w-none">
              {Array.isArray(post.body) && <PortableText value={post.body} />}
            </article>
          </div>
        </div>

        {/* Berita Terkait */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Berita Terkait</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost._id} 
                  href={`/${relatedPost.slug.current}`} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="relative h-40 w-full">
                    {relatedPost.imageUrl ? (
                      <Image
                        src={relatedPost.imageUrl}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                        <span className="text-gray-500">Tidak ada gambar</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="text-sm text-primary font-medium mb-2">
                      {formatDate(relatedPost.publishedAt)}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
                      {relatedPost.title}
                    </h3>
                    <span className="text-primary text-sm font-medium">Baca selengkapnya</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}