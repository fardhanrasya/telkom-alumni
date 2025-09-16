'use client';

import React from 'react';
import Link from 'next/link';
import { FaUserGraduate, FaGraduationCap, FaCalendarAlt, FaBuilding } from 'react-icons/fa';

const stats = [
  { 
    id: 1, 
    name: 'Alumni Terdaftar', 
    value: '5,000+',
    icon: <FaUserGraduate className="h-8 w-8 text-primary" />,
    description: 'Lebih dari 5.000 alumni telah bergabung dalam jaringan kami'
  },
  { 
    id: 2, 
    name: 'Jurusan', 
    value: '4',
    icon: <FaGraduationCap className="h-8 w-8 text-primary" />,
    description: 'Program studi unggulan berbasis teknologi'
  },
  { 
    id: 3, 
    name: 'Tahun Beroperasi', 
    value: '25+',
    icon: <FaCalendarAlt className="h-8 w-8 text-primary" />,
    description: 'Berdiri sejak tahun 1992, lebih dari 25 tahun berpengalaman'
  },
  { 
    id: 4, 
    name: 'Perusahaan Partner', 
    value: '100+',
    icon: <FaBuilding className="h-8 w-8 text-primary" />,
    description: 'Jaringan luas dengan perusahaan ternama'
  },
];

const StatsSection = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            SMK Telkom Jakarta dalam Angka
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Mencetak lulusan berkualitas sejak tahun 1992, SMK Telkom Jakarta telah menjadi pionir dalam pendidikan kejuruan berbasis teknologi.
          </p>
        </div>
        
        <div className="space-y-12">
          {stats.map((stat) => (
            <div 
              key={stat.id}
              className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center space-x-6 mb-6 md:mb-0">
                <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full">
                  {stat.icon}
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-900">{stat.name}</h3>
                  <p className="text-gray-600 mt-1">{stat.description}</p>
                </div>
              </div>
              <div className="text-5xl font-bold text-primary">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/tentang">
            <div className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-primary/90 transition-colors duration-200 shadow-lg hover:shadow-xl">
              Lihat Selengkapnya
              <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
