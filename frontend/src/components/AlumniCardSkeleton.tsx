import React from 'react';

const AlumniCardSkeleton: React.FC = () => {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-md">
      {/* Background skeleton */}
      <div className="h-full w-full animate-pulse bg-gray-300"></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
      
      {/* Badge skeleton */}
      <div className="absolute right-3 top-3 h-6 w-16 animate-pulse rounded-full bg-gray-400"></div>
      
      {/* Content skeleton */}
      <div className="absolute bottom-0 left-0 w-full p-4">
        <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-400"></div>
        <div className="mb-3 h-4 w-1/2 animate-pulse rounded bg-gray-400"></div>
        <div className="mt-2 flex items-center space-x-1">
          <div className="h-4 w-1/3 animate-pulse rounded bg-gray-400"></div>
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-400"></div>
        </div>
      </div>
    </div>
  );
};

export default AlumniCardSkeleton;