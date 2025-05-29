import { PortableText, PortableTextComponents } from "@portabletext/react";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";
import { getNewsBySlugQuery, getRelatedNewsQuery, getLatestNewsQuery } from "@/sanity/queries/newsQueries";

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

// Fungsi untuk memformat waktu baca
function calculateReadTime(content: any[]) {
  // Rata-rata kecepatan membaca (kata per menit)
  const wordsPerMinute = 200;
  
  // Menghitung jumlah kata dalam konten
  let wordCount = 0;
  
  if (Array.isArray(content)) {
    content.forEach(block => {
      if (block._type === 'block' && Array.isArray(block.children)) {
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
        console.log('Missing image asset reference', value);
        return null;
      }

      // Buat URL gambar dari _ref menggunakan format URL Sanity
      // Format: https://cdn.sanity.io/images/{projectId}/{dataset}/{imageId}-{dimensions}.{format}
      const imageRef = value.asset._ref;
      // Contoh _ref: image-fec5144cee6cfc77c47fe8af247ea8be63c9e3c0-432x576-jpg
      
      // Parse referensi gambar dengan lebih baik
      // Format referensi: image-{id}-{dimensions}-{format}
      const refParts = imageRef.split('-');
      
      // Pastikan ini adalah referensi gambar
      if (refParts[0] !== 'image') {
        console.log('Not an image reference', imageRef);
        return null;
      }
      
      // Ambil format dari bagian terakhir (jpg, png, dll)
      const format = refParts[refParts.length - 1];
      
      // Ambil dimensi dari bagian kedua terakhir (misal: 432x576)
      const dimensions = refParts[refParts.length - 2];
      
      // Ambil ID gambar (semua bagian di tengah)
      const id = refParts.slice(1, refParts.length - 2).join('-');
      
      // Gunakan projectId dan dataset dari konfigurasi client Sanity
      const { projectId, dataset } = client.config();
      const imageUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;

      return (
        <div className="my-8 relative rounded-lg overflow-hidden shadow-md">
          <div className="relative aspect-video">
            <Image
              src={imageUrl}
              alt={value.alt || 'Gambar berita'}
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
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold mt-5 mb-2 text-gray-900">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-bold mt-4 mb-2 text-gray-900">{children}</h4>,
    normal: ({ children }) => <p className="text-base mb-4 text-gray-700 leading-relaxed">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-gray-700 py-2">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-700">{children}</ol>,
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

export default async function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Mengambil data berita berdasarkan slug
  const news = await client.fetch<SanityDocument>(getNewsBySlugQuery, params, options);
  
  // Menghitung waktu baca
  const readTimeMinutes = calculateReadTime(news.body);
  
  // Mengambil berita terkait berdasarkan tag
  let relatedNews = await client.fetch<SanityDocument[]>(getRelatedNewsQuery, params, options);
  
  // Jika tidak ada berita terkait, ambil berita terbaru
  if (!relatedNews || relatedNews.length === 0) {
    relatedNews = await client.fetch<SanityDocument[]>(getLatestNewsQuery, params, options);
  }

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
              {news.tags && news.tags.length > 0 && news.tags.map((tag: any) => (
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                    <span className="text-primary font-bold text-lg">{news.author.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900">{news.author.name}</div>
                  {news.author.position && (
                    <div className="text-sm text-gray-600">{news.author.position}</div>
                  )}
                </div>
              </div>
            )}
            
            {/* Konten Artikel */}
            <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
              {Array.isArray(news.body) && <PortableText value={news.body} components={portableTextComponents} />}
            </article>
            
            {/* Tanggal Update */}
            {news.updatedAt && news.updatedAt !== news.publishedAt && (
              <div className="mt-8 text-sm text-gray-600 italic">
                Terakhir diperbarui pada {formatDate(news.updatedAt)}
              </div>
            )}
            
            {/* Share Buttons */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-gray-700 font-medium">Bagikan:</span>
                <button className="text-blue-600 hover:bg-blue-50 rounded-full p-2 transition-colors" aria-label="Bagikan ke Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="text-blue-400 hover:bg-blue-50 rounded-full p-2 transition-colors" aria-label="Bagikan ke Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button className="text-green-600 hover:bg-green-50 rounded-full p-2 transition-colors" aria-label="Bagikan ke WhatsApp">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M21.105 4.893c-1.827-1.827-4.25-2.833-6.837-2.833-5.327 0-9.67 4.343-9.67 9.67 0 1.707.45 3.375 1.304 4.842L4 22l5.628-1.476c1.414.77 3.013 1.176 4.64 1.176h.003c5.325 0 9.67-4.343 9.67-9.67 0-2.587-1.007-5.01-2.835-6.837zM14.268 19.7h-.003c-1.44 0-2.856-.387-4.093-1.118l-.292-.173-3.048.8.814-2.975-.19-.303c-.81-1.287-1.24-2.777-1.24-4.3 0-4.457 3.627-8.085 8.087-8.085 2.158 0 4.186.84 5.71 2.366 1.525 1.527 2.365 3.555 2.364 5.715 0 4.457-3.627 8.085-8.087 8.085zm4.442-6.054c-.244-.122-1.437-.71-1.66-.79-.223-.08-.385-.122-.547.122-.162.243-.627.79-.768.95-.142.162-.283.182-.527.06-.244-.12-1.03-.38-1.96-1.208-.725-.648-1.214-1.447-1.356-1.69-.142-.244-.015-.375.106-.497.11-.11.244-.284.365-.426.122-.142.162-.243.243-.405.08-.162.04-.304-.02-.426-.062-.122-.548-1.32-.75-1.807-.197-.47-.398-.405-.548-.413-.142-.008-.304-.01-.467-.01-.162 0-.425.06-.648.304-.223.243-.85.832-.85 2.028 0 1.196.873 2.352.994 2.514.122.162 1.7 2.596 4.12 3.642.575.248 1.025.397 1.377.508.58.184 1.107.158 1.524.096.465-.07 1.436-.586 1.64-1.152.202-.566.202-1.05.14-1.152-.06-.102-.223-.162-.466-.284z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="text-blue-700 hover:bg-blue-50 rounded-full p-2 transition-colors" aria-label="Bagikan ke LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zm-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.68 1.68 0 00-1.68 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Berita Terkait */}
        {relatedNews && relatedNews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Berita Terkait</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((relatedItem) => (
                <Link 
                  key={relatedItem._id} 
                  href={`/berita/${relatedItem.slug.current}`} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
                >
                  <div className="relative h-40 w-full">
                    {relatedItem.mainImageUrl ? (
                      <Image
                        src={relatedItem.mainImageUrl}
                        alt={relatedItem.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                        <span className="text-gray-500">Tidak ada gambar</span>
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