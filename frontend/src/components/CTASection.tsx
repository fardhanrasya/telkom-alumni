'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

const CTASection = () => {
  return (
    <div className="bg-gradient-to-r from-primary to-primary-700">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white/10 px-6 py-12 backdrop-blur-sm sm:py-16 md:px-12 shadow-lg">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Dapatkan Informasi Terbaru dari Komunitas Alumni
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/90">
              Ikuti perkembangan terbaru, berita, acara, dan lowongan kerja yang tersedia untuk alumni 
              SMK Telkom Jakarta melalui platform alumni kami.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Button href="/berita" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Baca Berita Terbaru
              </Button>
              <Button href="/karir" className="bg-white text-primary hover:bg-gray-100">
                Cari Lowongan Kerja
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
