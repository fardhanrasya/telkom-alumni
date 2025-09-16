export default function GallerySkeleton() {
  return (
    <div className="w-full">
      {/* Category Filter Skeleton */}
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"
          />
        ))}
      </div>

      {/* Masonry Grid Skeleton */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="break-inside-avoid mb-4">
            <div className="bg-gray-200 rounded-lg animate-pulse">
              <div
                className="w-full bg-gray-300 rounded-lg"
                style={{
                  height: `${Math.floor(Math.random() * 200) + 200}px`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
