import React from 'react';

const ContributorsSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="h-10 w-72 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
          <div className="h-6 w-96 bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>

        <div className="mt-12 grid gap-8 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="text-center">
              {/* Avatar skeleton */}
              <div className="mx-auto h-32 w-32 rounded-full bg-gray-200 animate-pulse"></div>
              
              {/* Name skeleton */}
              <div className="mt-4 h-6 w-24 rounded bg-gray-200 mx-auto animate-pulse"></div>
              
              {/* Role skeleton */}
              <div className="mt-2 h-4 w-20 rounded bg-gray-200 mx-auto animate-pulse"></div>
              
              {/* Contributions skeleton */}
              <div className="mt-2 h-4 w-16 rounded bg-gray-200 mx-auto animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContributorsSkeleton;