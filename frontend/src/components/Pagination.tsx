import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from './ui/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  baseUrl?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  baseUrl,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Fungsi untuk membuat URL dengan parameter halaman
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    
    // Jika baseUrl disediakan, gunakan itu, jika tidak gunakan pathname saat ini
    return `${baseUrl || pathname}?${params.toString()}`;
  };
  // Hitung halaman yang akan ditampilkan dalam pagination
  const getPageNumbers = () => {
    // Jika total halaman <= 5, tampilkan semua halaman
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Tampilkan 5 halaman dengan halaman aktif di tengah jika memungkinkan
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
      <div className="flex flex-1 justify-between sm:hidden">
        {currentPage > 1 ? (
          <Link href={createPageUrl(currentPage - 1)} aria-label="Halaman sebelumnya" className="inline-block">
            <Button
              variant="outline"
              size="sm"
              onClick={onPageChange ? () => onPageChange(currentPage - 1) : undefined}
            >
              Sebelumnya
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Sebelumnya
          </Button>
        )}
        
        {currentPage < totalPages ? (
          <Link href={createPageUrl(currentPage + 1)} aria-label="Halaman berikutnya" className="inline-block">
            <Button
              variant="outline"
              size="sm"
              onClick={onPageChange ? () => onPageChange(currentPage + 1) : undefined}
            >
              Berikutnya
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Berikutnya
          </Button>
        )}
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Halaman <span className="font-medium">{currentPage}</span> dari{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {currentPage > 1 ? (
              <Link 
                href={createPageUrl(currentPage - 1)}
                aria-label="Halaman sebelumnya"
                onClick={onPageChange ? (e) => {
                  e.preventDefault();
                  onPageChange(currentPage - 1);
                } : undefined}
                className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20`}
              >
                <span className="sr-only">Sebelumnya</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            ) : (
              <button
                disabled
                className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium cursor-not-allowed text-gray-300 focus:z-20`}
              >
                <span className="sr-only">Sebelumnya</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}

            {pageNumbers.map((page) => (
              <Link
                key={page}
                href={createPageUrl(page)}
                onClick={onPageChange ? (e) => {
                  e.preventDefault();
                  onPageChange(page);
                } : undefined}
                aria-current={currentPage === page ? 'page' : undefined}
                className={`relative inline-flex items-center border ${currentPage === page
                  ? 'z-10 border-primary bg-primary-50 text-primary'
                  : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                  } px-4 py-2 text-sm font-medium focus:z-20`}
              >
                {page}
              </Link>
            ))}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                ...
              </span>
            )}

            {currentPage < totalPages ? (
              <Link 
                href={createPageUrl(currentPage + 1)}
                aria-label="Halaman berikutnya"
                onClick={onPageChange ? (e) => {
                  e.preventDefault();
                  onPageChange(currentPage + 1);
                } : undefined}
                className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20`}
              >
                <span className="sr-only">Berikutnya</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            ) : (
              <button
                disabled
                className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium cursor-not-allowed text-gray-300 focus:z-20`}
              >
                <span className="sr-only">Berikutnya</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;