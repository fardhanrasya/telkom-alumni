import React from 'react';
import ContributorsSkeleton from '@/components/ContributorsSkeleton';

const AboutPageSkeleton: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-br from-primary-50 to-gray-100 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-12 w-96 bg-gray-200 rounded animate-pulse mx-auto mb-6"></div>
            <div className="h-6 w-80 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Visi dan Misi Skeleton */}
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 md:grid-cols-2">
            {/* Visi Skeleton */}
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <div className="mb-4 h-16 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-2 w-full">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Misi Skeleton */}
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <div className="mb-4 h-16 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-3 w-full">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-start">
                    <div className="h-5 w-5 bg-gray-200 rounded animate-pulse mt-1 flex-shrink-0"></div>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse ml-2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sejarah Skeleton */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="h-10 w-80 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
          </div>

          {/* Stats skeleton */}
          <div className="mt-12">
            <div className="grid gap-8 md:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="rounded-lg bg-white p-6 shadow-md">
                  <div className="mb-4 h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Skeleton */}
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-6 w-96 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <div className="space-y-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="rounded-lg bg-white p-6 shadow-md">
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contributors Skeleton */}
      <ContributorsSkeleton />
    </div>
  );
};

export default AboutPageSkeleton;