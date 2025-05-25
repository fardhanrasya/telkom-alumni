'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type SanityDocument } from 'next-sanity';
import { extractPreviewText } from '@/sanity/utils';

interface NewsSectionProps {
  posts: SanityDocument[];
}

// Format tanggal untuk tampilan yang lebih baik
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

const NewsSection: React.FC<NewsSectionProps> = ({ posts }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Berita Terbaru
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan informasi dan kegiatan terbaru seputar alumni SMK Telkom Jakarta
          </p>
        </div>

        {posts && posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/${post.slug.current}`}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-48 w-full bg-gray-200">
                    {post.imageUrl && (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="bg-primary-50 text-primary text-xs px-3 py-1 rounded-full font-medium">
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-4 text-sm">
                      {extractPreviewText(post.body) || 'Baca selengkapnya tentang informasi terbaru dari komunitas alumni'}
                    </p>
                    <div className="text-primary font-medium group-hover:underline flex items-center">
                      Baca Selengkapnya
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/berita"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-700 transition-colors"
              >
                Lihat Semua Berita
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m0 16v1m-9-9h1m8 -9h1M5.6 5.6l.8.8m12 0l-.8.8m0 12l.8-.8m-12 0l-.8.8" />
            </svg>
            <h3 className="mt-2 text-xl font-medium text-gray-900">Belum ada berita</h3>
            <p className="mt-1 text-gray-500">Nantikan informasi dan berita terbaru dari kami</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
