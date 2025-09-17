import { PortableText, PortableTextComponents } from "@portabletext/react";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";
import {
  getNewsBySlugQuery,
  getRelatedNewsQuery,
  getLatestNewsQuery,
  getRecentNewsQuery,
} from "@/sanity/queries/newsQueries";
import { getUpcomingEventsQuery } from "@/sanity/queries/eventQueries";
import NewsSidebar from "@/components/NewsSidebar";
import SocialShareButtons from "@/components/SocialShareButtons";
import { Metadata } from "next";

const options = { next: { revalidate: 30 } };

// Format tanggal untuk tampilan yang lebih baik
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// Fungsi untuk memformat waktu baca
function calculateReadTime(content: any[]) {
  // Rata-rata kecepatan membaca (kata per menit)
  const wordsPerMinute = 200;

  // Menghitung jumlah kata dalam konten
  let wordCount = 0;

  if (Array.isArray(content)) {
    content.forEach((block) => {
      if (block._type === "block" && Array.isArray(block.children)) {
        block.children.forEach((child: { text?: string }) => {
          if (child.text) {
            wordCount += child.text.split(/\s+/).length;
          }
        });
      }
    });
  }

  // Menghitung waktu baca dalam menit
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return readTimeMinutes;
}

// Konfigurasi komponen untuk PortableText
const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      // Periksa apakah asset ada dan memiliki _ref
      if (!value || !value.asset || !value.asset._ref) {
        console.log("Missing image asset reference", value);
        return null;
      }

      // Buat URL gambar dari _ref menggunakan format URL Sanity
      // Format: https://cdn.sanity.io/images/{projectId}/{dataset}/{imageId}-{dimensions}.{format}
      const imageRef = value.asset._ref;
      // Contoh _ref: image-fec5144cee6cfc77c47fe8af247ea8be63c9e3c0-432x576-jpg

      // Parse referensi gambar dengan lebih baik
      // Format referensi: image-{id}-{dimensions}-{format}
      const refParts = imageRef.split("-");

      // Pastikan ini adalah referensi gambar
      if (refParts[0] !== "image") {
        console.log("Not an image reference", imageRef);
        return null;
      }

      // Ambil format dari bagian terakhir (jpg, png, dll)
      const format = refParts[refParts.length - 1];

      // Ambil dimensi dari bagian kedua terakhir (misal: 432x576)
      const dimensions = refParts[refParts.length - 2];

      // Ambil ID gambar (semua bagian di tengah)
      const id = refParts.slice(1, refParts.length - 2).join("-");

      // Gunakan projectId dan dataset dari konfigurasi client Sanity
      const { projectId, dataset } = client.config();
      const imageUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;

      return (
        <div className="my-8 relative rounded-lg overflow-hidden shadow-md">
          <div className="relative aspect-video">
            <Image
              src={imageUrl}
              alt={value.alt || "Gambar berita"}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <div className="bg-gray-100 p-3 text-sm text-gray-700 italic text-center">
              {value.caption}
            </div>
          )}
        </div>
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold mt-5 mb-2 text-gray-900">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-bold mt-4 mb-2 text-gray-900">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="text-base mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-gray-700 py-2">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-700">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline font-medium"
      >
        {children}
      </a>
    ),
  },
};

// Definisikan tipe params sesuai dengan yang diharapkan Next.js
type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  // Await params before using its properties
  const resolvedParams = await params;

  // Get the current URL for sharing
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://telkom-alumni.vercel.app";
  const currentUrl = `${baseUrl}/berita/${resolvedParams.slug}`;

  // Mengambil data berita berdasarkan slug
  const news = await client.fetch<SanityDocument>(
    getNewsBySlugQuery,
    resolvedParams,
    options
  );

  // Menghitung waktu baca
  const readTimeMinutes = calculateReadTime(news.body);

  // Mengambil berita terkait berdasarkan tag
  let relatedNews = await client.fetch<SanityDocument[]>(
    getRelatedNewsQuery,
    resolvedParams,
    options
  );

  // Jika tidak ada berita terkait, ambil berita terbaru
  if (!relatedNews || relatedNews.length === 0) {
    relatedNews = await client.fetch<SanityDocument[]>(
      getLatestNewsQuery,
      resolvedParams,
      options
    );
  }

  // Mengambil data untuk sidebar
  const latestNews = await client.fetch<SanityDocument[]>(
    getRecentNewsQuery(5),
    {},
    options
  );

  const upcomingEvents = await client.fetch<SanityDocument[]>(
    getUpcomingEventsQuery(3),
    {},
    options
  );

  // Filter berita terbaru untuk tidak menampilkan berita yang sedang dibaca
  const filteredLatestNews = latestNews.filter(
    (item) => item.slug.current !== resolvedParams.slug
  );

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Navigasi kembali */}
        <div className="mb-8">
          <Link
            href="/berita"
            className="inline-flex items-center text-primary hover:text-primary-700 font-medium transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Kembali ke Berita
          </Link>
        </div>

        {/* Layout dengan Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Konten Utama */}
          <div className="lg:col-span-3">
            {/* Header Artikel */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
              {/* Gambar Artikel */}
              {news.mainImageUrl && (
                <div className="relative h-64 sm:h-96 w-full">
                  <Image
                    src={news.mainImageUrl}
                    alt={news.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div className="p-8">
                {/* Tag dan Tanggal */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {news.tags &&
                    news.tags.length > 0 &&
                    news.tags.map((tag: any) => (
                      <Link
                        key={tag.slug.current}
                        href={`/berita?tag=${tag.slug.current}`}
                        className="inline-block bg-primary-50 text-primary rounded-full px-3 py-1 text-sm font-semibold hover:bg-primary-100 transition-colors"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  <span className="text-sm text-gray-600">
                    {formatDate(news.publishedAt)}
                  </span>
                  <span className="text-sm text-gray-600 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {readTimeMinutes} menit baca
                  </span>
                </div>

                {/* Judul dan Subjudul */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                  {news.title}
                </h1>
                {news.subtitle && (
                  <p className="text-xl text-gray-700 mb-6">{news.subtitle}</p>
                )}

                {/* Info Penulis */}
                {news.author && (
                  <div className="flex items-center mb-8 border-b border-gray-200 pb-6">
                    {news.author.image ? (
                      <div className="w-12 h-12 overflow-hidden rounded-full mr-4">
                        <Image
                          src={news.author.image}
                          alt={news.author.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                        <span className="text-primary font-bold text-lg">
                          {news.author.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900">
                        {news.author.name}
                      </div>
                      {news.author.position && (
                        <div className="text-sm text-gray-600">
                          {news.author.position}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Konten Artikel */}
                <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
                  {Array.isArray(news.body) && (
                    <PortableText
                      value={news.body}
                      components={portableTextComponents}
                    />
                  )}
                </article>

                {/* Tanggal Update */}
                {news.updatedAt && news.updatedAt !== news.publishedAt && (
                  <div className="mt-8 text-sm text-gray-600 italic">
                    Terakhir diperbarui pada {formatDate(news.updatedAt)}
                  </div>
                )}

                {/* Social Share Buttons */}
                <SocialShareButtons
                  title={news.title}
                  url={currentUrl}
                  description={news.excerpt || news.subtitle}
                />
              </div>
            </div>

            {/* Berita Terkait */}
            {relatedNews && relatedNews.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Berita Terkait
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedNews.map((relatedItem) => (
                    <Link
                      key={relatedItem._id}
                      href={`/berita/${relatedItem.slug.current}`}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
                    >
                      <div className="relative h-32 w-full">
                        {relatedItem.mainImageUrl ? (
                          <Image
                            src={relatedItem.mainImageUrl}
                            alt={relatedItem.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                            <span className="text-gray-500">
                              Tidak ada gambar
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="text-sm text-primary font-medium mb-2">
                          {formatDate(relatedItem.publishedAt)}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
                          {relatedItem.title}
                        </h3>
                        <span className="text-primary text-sm font-medium">
                          Baca selengkapnya
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <NewsSidebar
                latestNews={filteredLatestNews}
                upcomingEvents={upcomingEvents}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  // Await params before using its properties
  const resolvedParams = await params;

  const news = await client.fetch<SanityDocument>(
    getNewsBySlugQuery,
    resolvedParams,
    options
  );

  if (!news) {
    return {
      title: "Berita Tidak Ditemukan | Portal Alumni SMK Telkom Jakarta",
      description: "Berita yang Anda cari tidak ditemukan.",
    };
  }

  const description =
    news.excerpt || `Berita terbaru dari SMK Telkom Jakarta: ${news.title}`;
  const imageUrl = news.mainImageUrl || "/berita-hero.jpg";

  return {
    title: `${news.title} | Portal Alumni SMK Telkom Jakarta`,
    description: description,
    openGraph: {
      title: `${news.title} | Portal Alumni SMK Telkom Jakarta`,
      description: description,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: news.title,
        },
      ],
      publishedTime: news.publishedAt,
      authors: news.authorName ? [news.authorName] : undefined,
      tags: news.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${news.title} | Portal Alumni SMK Telkom Jakarta`,
      description: description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `/berita/${resolvedParams.slug}`,
    },
  };
}
