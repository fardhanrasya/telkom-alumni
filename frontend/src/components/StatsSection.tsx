'use client';

import React from 'react';

const stats = [
  { id: 1, name: 'Alumni Terdaftar', value: '5,000+' },
  { id: 2, name: 'Jurusan', value: '4' },
  { id: 3, name: 'Tahun Beroperasi', value: '25+' },
  { id: 4, name: 'Perusahaan Partner', value: '100+' },
];

const StatsSection = () => {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            SMK Telkom Jakarta dalam Angka
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Mencetak lulusan berkualitas sejak tahun 1992, SMK Telkom Jakarta telah menjadi pionir dalam pendidikan kejuruan berbasis teknologi.
          </p>
        </div>
        <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col rounded-lg border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md"
            >
              <dt className="text-lg font-medium text-gray-600">{stat.name}</dt>
              <dd className="mt-2 text-4xl font-bold tracking-tight text-primary">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default StatsSection;
