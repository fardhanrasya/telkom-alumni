import React from 'react';

const FeaturedNewsSkeleton: React.FC = () => {
  return (
    <div className="mb-12">
      {/* Header skeleton */}
      <div className="flex items-center mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="ml-4 h-1 bg-gray-200 flex-grow rounded-full animate-pulse"></div>
      </div>
      
      {/* Featured news card skeleton */}
      <div className="block bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-5 gap-6">
          {/* Image skeleton */}
          <div className="md:col-span-3 relative h-64 md:h-96 bg-gray-200 animate-pulse"></div>
          
          {/* Content skeleton */}
          <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-center">
            {/* Tags and date skeleton */}
            <div className="flex items-center mb-4 space-x-3">
              <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            
            {/* Title skeleton */}
            <div className="space-y-3 mb-4">
              <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-4/5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-3/5 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Subtitle skeleton */}
            <div className="space-y-2 mb-3">
              <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Excerpt skeleton */}
            <div className="space-y-2 mb-6">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* CTA skeleton */}
            <div className="mt-auto flex items-center">
              <div className="h-6 w-36 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedNewsSkeleton;