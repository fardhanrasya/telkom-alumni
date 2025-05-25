'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:items-center">
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                <span className="block">Jaringan Alumni</span>
                <span className="block text-primary">SMK Telkom Jakarta</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-gray-600">
                Menghubungkan para alumni dalam satu platform untuk berbagi informasi, 
                pengalaman, dan membangun jaringan profesional yang kuat.
              </p>
            </div>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button href="/daftar" size="lg">
                Bergabung Sekarang
              </Button>
              <Button href="/alumni" variant="outline" size="lg">
                Lihat Direktori Alumni
              </Button>
            </div>
            <div className="mt-8 flex items-center space-x-6">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-white"
                    >
                      <Image
                        src={`/avatar-${i}.jpg`}
                        alt={`Alumni ${i}`}
                        className="object-cover"
                        fill
                      />
                    </div>
                  ))}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">2000+ Alumni</p>
                  <p className="text-xs text-gray-600">Bergabung dengan kami</p>
                </div>
              </div>
              <div className="hidden md:block h-8 w-px bg-gray-300"></div>
              <div className="hidden md:flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-900">Terverifikasi</p>
                  <p className="text-xs text-gray-600">Komunitas terpercaya</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative h-[300px] w-full overflow-hidden rounded-xl md:h-[500px]">
              <Image
                src="/hero-image.jpg"
                alt="Alumni SMK Telkom Jakarta"
                className="object-cover"
                fill
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
