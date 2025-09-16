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
      className="group relative block h-full transform overflow-hidden rounded-lg shadow-md transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={alumni.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-300 ease-in-out group-hover:scale-105"
            priority={false}
          />
        </div>
        
        {/* Gradient Overlay - Lebih soft */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-75" />
        
        {/* Soft shadow untuk teks */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Badge tahun lulus */}
        <div className="absolute right-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-white shadow-lg">
          {alumni.yearGraduated}
        </div>

        {/* Konten */}
        <div className="absolute bottom-0 left-0 w-full p-4 text-white">
          <h3 className="mb-1 line-clamp-1 text-lg font-bold group-hover:text-primary-100 transition-colors duration-300">
            {alumni.name}
          </h3>
          
          <p className="mb-2 line-clamp-1 text-sm text-white/80">
            {getMajorLabel(alumni.major)}
          </p>
          
          {alumni.currentJob && (
            <div className="mt-1">
              <div className="flex items-center space-x-1 text-sm">
                {alumni.currentJob.title && (
                  <span className="font-medium text-white/90">
                    {alumni.currentJob.title}
                  </span>
                )}
                
                {alumni.currentJob.company && (
                  <>
                    <span className="text-white/70">di</span>
                    <span className="font-medium text-primary-200">
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
