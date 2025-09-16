"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { type SanityDocument } from "next-sanity";

interface NewsSidebarProps {
  latestNews: SanityDocument[];
  upcomingEvents: SanityDocument[];
}

// Format tanggal untuk tampilan yang lebih baik
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

// Format waktu dari datetime
function formatTime(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const NewsSidebar: React.FC<NewsSidebarProps> = ({
  latestNews,
  upcomingEvents,
}) => {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Layout Mobile - Horizontal */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Berita Terbaru - Mobile */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Berita Terbaru</h3>
            <div className="ml-2 h-1 bg-primary flex-grow rounded-full"></div>
          </div>

          {latestNews && latestNews.length > 0 ? (
            <div className="space-y-3">
              {latestNews.slice(0, 3).map((news, index) => (
                <Link
                  key={news._id}
                  href={`/berita/${news.slug.current}`}
                  className="group block"
                >
                  <div
                    className={`pb-3 ${
                      index !== 2 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <p className="text-xs text-primary font-medium mb-1">
                      {formatDate(news.publishedAt)}
                    </p>
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {news.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Belum ada berita terbaru
            </p>
          )}

          <div className="mt-4 pt-3 border-t border-gray-100">
            <Link
              href="/berita"
              className="text-primary hover:text-primary-700 font-medium text-sm flex items-center justify-center"
            >
              Lihat Semua
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Acara Mendatang - Mobile */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Acara Mendatang</h3>
            <div className="ml-2 h-1 bg-primary flex-grow rounded-full"></div>
          </div>

          {upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.slice(0, 2).map((event, index) => (
                <Link
                  key={event._id}
                  href={`/acara/${event.slug.current}`}
                  className="group block"
                >
                  <div
                    className={`pb-3 ${
                      index !== 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          {new Date(event.startDate).getDate()}
                        </span>
                        <span className="text-xs text-primary">
                          {new Date(event.startDate).toLocaleDateString(
                            "id-ID",
                            { month: "short" }
                          )}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {event.isVirtual
                            ? "Online"
                            : event.location?.name || "TBA"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Belum ada acara mendatang
            </p>
          )}

          <div className="mt-4 pt-3 border-t border-gray-100">
            <Link
              href="/acara"
              className="text-primary hover:text-primary-700 font-medium text-sm flex items-center justify-center"
            >
              Lihat Semua
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Layout Desktop - Vertical */}
      <div className="hidden lg:block space-y-8">
        {/* Berita Terbaru */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Berita Terbaru</h3>
            <div className="ml-3 h-1 bg-primary flex-grow rounded-full"></div>
          </div>

          {latestNews && latestNews.length > 0 ? (
            <div className="space-y-4">
              {latestNews.map((news, index) => (
                <Link
                  key={news._id}
                  href={`/berita/${news.slug.current}`}
                  className="group block"
                >
                  <div
                    className={`flex gap-3 pb-4 ${
                      index !== latestNews.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                      {news.mainImageUrl ? (
                        <Image
                          src={news.mainImageUrl}
                          alt={news.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-primary font-medium mb-1">
                        {formatDate(news.publishedAt)}
                      </p>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {news.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <svg
                className="mx-auto h-8 w-8 text-gray-400 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <p className="text-sm text-gray-500">Belum ada berita terbaru</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              href="/berita"
              className="text-primary hover:text-primary-700 font-medium text-sm flex items-center justify-center"
            >
              Lihat Semua Berita
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Acara Mendatang */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Acara Mendatang</h3>
            <div className="ml-3 h-1 bg-primary flex-grow rounded-full"></div>
          </div>

          {upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <Link
                  key={event._id}
                  href={`/acara/${event.slug.current}`}
                  className="group block"
                >
                  <div
                    className={`pb-4 ${
                      index !== upcomingEvents.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          {new Date(event.startDate).getDate()}
                        </span>
                        <span className="text-xs text-primary">
                          {new Date(event.startDate).toLocaleDateString(
                            "id-ID",
                            { month: "short" }
                          )}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-1">
                          {event.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <svg
                            className="w-3 h-3 mr-1"
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
                          {formatTime(event.startDate)}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {event.isVirtual
                            ? "Online"
                            : event.location?.name || "TBA"}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <svg
                className="mx-auto h-8 w-8 text-gray-400 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-500">Belum ada acara mendatang</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              href="/acara"
              className="text-primary hover:text-primary-700 font-medium text-sm flex items-center justify-center"
            >
              Lihat Semua Acara
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Banner atau Widget Tambahan */}
        <div className="bg-gradient-to-br from-primary to-primary-700 rounded-xl shadow-md p-6 text-white">
          <h3 className="text-lg font-bold mb-2">Bergabung dengan Alumni</h3>
          <p className="text-sm text-primary-100 mb-4">
            Dapatkan update terbaru tentang kegiatan dan peluang karir untuk
            alumni SMK Telkom Jakarta.
          </p>
          <Link
            href="/alumni"
            className="inline-flex items-center text-sm font-medium text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            Daftar Sekarang
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsSidebar;
