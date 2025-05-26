import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Tipe data untuk alumni dari Sanity
export interface Alumni {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  yearGraduated: number;
  major: string;
  profileImageUrl?: string;
  currentJob?: {
    title?: string;
    company?: string;
  };
}

interface AlumniCardProps {
  alumni: Alumni;
}

const AlumniCard: React.FC<AlumniCardProps> = ({ alumni }) => {
  // Untuk menentukan label jurusan yang benar berdasarkan value dari Sanity
  const getMajorLabel = (majorValue: string) => {
    switch (majorValue) {
      case 'rpl':
        return 'Rekayasa Perangkat Lunak';
      case 'tkj':
        return 'Teknik Komputer dan Jaringan';
      case 'mm':
        return 'Multimedia';
      case 'tei':
        return 'Teknik Elektronika Industri';
      default:
        return majorValue;
    }
  };

  // Fallback image jika tidak ada gambar profil
  const imageUrl = alumni.profileImageUrl || '/avatar-placeholder.png';

  return (
    <Link
      href={`/alumni/${alumni.slug.current}`}
      className="group relative block h-full transform overflow-hidden rounded-lg bg-white shadow-md transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-full flex-col">
        {/* Wrapper untuk gambar dengan rasio aspek tetap */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={alumni.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
            priority={false}
          />
        </div>

        {/* Badge tahun lulus */}
        <div className="absolute right-2 top-2 rounded-full bg-primary/90 px-2 py-1 text-xs font-semibold text-white">
          {alumni.yearGraduated}
        </div>

        {/* Konten */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-1 line-clamp-1 text-lg font-bold text-gray-900">
            {alumni.name}
          </h3>
          
          <p className="mb-2 line-clamp-1 text-sm text-gray-600">
            {getMajorLabel(alumni.major)}
          </p>
          
          {alumni.currentJob && (
            <div className="mt-auto">
              <div className="flex items-center space-x-1 text-sm">
                {alumni.currentJob.title && (
                  <span className="font-medium text-gray-900">
                    {alumni.currentJob.title}
                  </span>
                )}
                
                {alumni.currentJob.company && (
                  <>
                    <span className="text-gray-500">di</span>
                    <span className="font-medium text-primary">
                      {alumni.currentJob.company}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default AlumniCard;
