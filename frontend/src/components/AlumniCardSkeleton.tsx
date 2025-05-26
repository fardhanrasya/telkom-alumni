import React from 'react';

const AlumniCardSkeleton: React.FC = () => {
  return (
    <div className="h-full overflow-hidden rounded-lg bg-white shadow-md">
      <div className="relative aspect-[4/3] w-full animate-pulse bg-gray-200"></div>
      <div className="p-4">
        <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
        <div className="mb-3 h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
        <div className="mt-2 flex items-center space-x-1">
          <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default AlumniCardSkeleton;