'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { type SanityDocument } from 'next-sanity';

interface UpcomingEventsProps {
  events: SanityDocument[];
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

// Format waktu dari datetime
function formatTime(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Acara Mendatang
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Jangan lewatkan berbagai acara menarik untuk memperluas jaringan dan mengembangkan diri bersama komunitas alumni.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events && events.length > 0 ? (
            events.map((event) => (
              <div
                key={event._id}
                className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      fill
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Tidak ada gambar</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <svg
                        className="h-5 w-5 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{formatDate(event.startDate)}</span>
                      <span>•</span>
                      <span>{formatTime(event.startDate)}</span>
                    </div>
                    <Link
                      href={`/acara/${event.slug.current}`}
                      className="mt-2 block text-xl font-semibold text-gray-900 hover:text-primary"
                    >
                      {event.title}
                    </Link>
                    <div className="mt-3 flex items-center space-x-2 text-sm text-gray-500">
                      <svg
                        className="h-5 w-5 text-primary"
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
                      <span>
                        {event.isVirtual 
                          ? 'Online' 
                          : (event.location?.name || 'Lokasi tidak tersedia')}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button
                      href={`/acara/${event.slug.current}`}
                      variant="outline"
                      className="w-full"
                    >
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-xl font-medium text-gray-900">Belum ada acara mendatang</h3>
              <p className="mt-1 text-gray-500">Nantikan acara menarik kami berikutnya.</p>
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Button href="/acara" variant="default">
            Lihat Semua Acara
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;
