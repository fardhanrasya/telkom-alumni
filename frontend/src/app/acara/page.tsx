'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

// Contoh data acara
const eventData = [
  {
    id: '1',
    title: 'Reuni Akbar Alumni 2024',
    date: '24 Juni 2024',
    startTime: '10:00',
    endTime: '16:00',
    location: 'Aula SMK Telkom Jakarta',
    isVirtual: false,
    image: '/event-1.jpg',
    description: 'Reuni akbar seluruh alumni SMK Telkom Jakarta dari berbagai angkatan. Acara ini akan diisi dengan berbagai kegiatan seru, mulai dari sharing session, workshop, hingga hiburan.',
    slug: 'reuni-akbar-alumni-2024',
  },
  {
    id: '2',
    title: 'Workshop Kewirausahaan Digital',
    date: '15 Juli 2024',
    startTime: '13:00',
    endTime: '17:00',
    location: 'Online via Zoom',
    isVirtual: true,
    image: '/event-2.jpg',
    description: 'Workshop online tentang bagaimana memulai dan mengembangkan bisnis digital di era industri 4.0. Dibawakan oleh alumni sukses yang telah membangun startup.',
    slug: 'workshop-kewirausahaan-digital',
  },
  {
    id: '3',
    title: 'Career Talk: Peluang di Industri IT',
    date: '28 Juli 2024',
    startTime: '14:00',
    endTime: '16:00',
    location: 'Online via Zoom',
    isVirtual: true,
    image: '/event-3.jpg',
    description: 'Diskusi tentang peluang karir di industri IT dengan pembicara dari perusahaan teknologi terkemuka seperti Tokopedia, Gojek, dan Traveloka.',
    slug: 'career-talk-peluang-industri-it',
  },
  {
    id: '4',
    title: 'Networking Night: Alumni & Industri',
    date: '10 Agustus 2024',
    startTime: '18:00',
    endTime: '21:00',
    location: 'Hotel Borobudur Jakarta',
    isVirtual: false,
    image: '/event-4.jpg',
    description: 'Malam networking untuk mempertemukan alumni dengan perwakilan industri. Kesempatan untuk memperluas jaringan profesional dan mencari peluang kolaborasi.',
    slug: 'networking-night-alumni-industri',
  },
  {
    id: '5',
    title: 'Seminar Teknologi: AI & Machine Learning',
    date: '25 Agustus 2024',
    startTime: '09:00',
    endTime: '12:00',
    location: 'Aula SMK Telkom Jakarta',
    isVirtual: false,
    image: '/event-5.jpg',
    description: 'Seminar tentang perkembangan terkini dalam bidang Kecerdasan Buatan dan Machine Learning. Dibawakan oleh pakar AI dari kalangan alumni.',
    slug: 'seminar-teknologi-ai-machine-learning',
  },
  {
    id: '6',
    title: 'Mentoring Session: Persiapan Memasuki Dunia Kerja',
    date: '5 September 2024',
    startTime: '15:00',
    endTime: '17:00',
    location: 'Online via Microsoft Teams',
    isVirtual: true,
    image: '/event-6.jpg',
    description: 'Sesi mentoring untuk para alumni baru yang akan memasuki dunia kerja. Berisi tips interview, pembuatan CV, dan pengembangan soft skill.',
    slug: 'mentoring-session-persiapan-dunia-kerja',
  },
];

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Filter acara berdasarkan pencarian dan tipe acara
  const filteredEvents = eventData.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || 
                       (selectedType === 'online' && event.isVirtual) || 
                       (selectedType === 'offline' && !event.isVirtual);
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Acara & Kegiatan</h1>
          <p className="mt-4 text-lg text-gray-600">
            Temukan berbagai acara menarik yang diselenggarakan oleh alumni dan SMK Telkom Jakarta
          </p>
        </div>

        {/* Filter dan Pencarian */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Cari Acara
              </label>
              <input
                type="text"
                id="search"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Cari berdasarkan judul atau deskripsi acara"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Tipe Acara
              </label>
              <select
                id="type"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">Semua Acara</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hasil Pencarian */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Menampilkan {filteredEvents.length} acara
          </p>
        </div>

        {/* Daftar Acara */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  fill
                />
                {event.isVirtual && (
                  <div className="absolute right-3 top-3 rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">
                    Online
                  </div>
                )}
                {!event.isVirtual && (
                  <div className="absolute right-3 top-3 rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">
                    Offline
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
                    <span>{event.date}</span>
                    <span>•</span>
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>
                  <Link
                    href={`/acara/${event.slug}`}
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
                    <span>{event.location}</span>
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm text-gray-600">
                    {event.description}
                  </p>
                </div>
                <div className="mt-6">
                  <Button
                    href={`/acara/${event.slug}`}
                    variant="outline"
                    className="w-full"
                  >
                    Lihat Detail
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button variant="outline" size="sm">
              Sebelumnya
            </Button>
            <Button variant="outline" size="sm">
              Berikutnya
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Menampilkan <span className="font-medium">1</span> sampai{' '}
                <span className="font-medium">{filteredEvents.length}</span> dari{' '}
                <span className="font-medium">{eventData.length}</span> acara
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                >
                  <span className="sr-only">Sebelumnya</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-current="page"
                  className="relative z-10 inline-flex items-center border border-primary bg-primary-50 px-4 py-2 text-sm font-medium text-primary focus:z-20"
                >
                  1
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                >
                  <span className="sr-only">Berikutnya</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
