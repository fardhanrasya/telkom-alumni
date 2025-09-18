import React, { useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';

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
  
  // Menghitung nomor halaman yang akan ditampilkan
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

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
  }, [currentPage, totalPages]);

  // Fungsi untuk membuat URL dengan parameter halaman
  const createPageUrl = useCallback((pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${baseUrl || pathname}?${params.toString()}`;
  }, [searchParams, baseUrl, pathname]);

  // Handler untuk perubahan halaman
  const handlePageChange = useCallback((pageNumber: number) => {
    onPageChange?.(pageNumber);
  }, [onPageChange]);

  const handlePrevClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handlePageChange(currentPage - 1);
  }, [currentPage, handlePageChange]);

  const handleNextClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handlePageChange(currentPage + 1);
  }, [currentPage, handlePageChange]);

  // Kembali lebih awal jika hanya ada satu halaman
  if (totalPages <= 1) {
    return null;
  }

  const showEllipsis = totalPages > 5 && currentPage < totalPages - 2;
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
      {/* Mobile View */}
      <MobilePagination
        hasPrevPage={hasPrevPage}
        hasNextPage={hasNextPage}
        createPageUrl={createPageUrl}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
      />
      
      {/* Desktop View */}
      <DesktopPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageNumbers={pageNumbers}
        showEllipsis={showEllipsis}
        hasPrevPage={hasPrevPage}
        hasNextPage={hasNextPage}
        createPageUrl={createPageUrl}
        handlePageChange={handlePageChange}
        handlePrevClick={handlePrevClick}
        handleNextClick={handleNextClick}
      />
    </div>
  );
};

// Mobile Pagination Component
const MobilePagination: React.FC<{
  hasPrevPage: boolean;
  hasNextPage: boolean;
  createPageUrl: (page: number) => string;
  handlePageChange: (page: number) => void;
  currentPage: number;
}> = ({ hasPrevPage, hasNextPage, createPageUrl, handlePageChange, currentPage }) => (
  <div className="flex flex-1 justify-between sm:hidden">
    <PaginationButton
      variant="outline"
      size="sm"
      disabled={!hasPrevPage}
      href={hasPrevPage ? createPageUrl(currentPage - 1) : undefined}
      onClick={hasPrevPage ? () => handlePageChange(currentPage - 1) : undefined}
      aria-label="Halaman sebelumnya"
    >
      Sebelumnya
    </PaginationButton>
    
    <PaginationButton
      variant="outline"
      size="sm"
      disabled={!hasNextPage}
      href={hasNextPage ? createPageUrl(currentPage + 1) : undefined}
      onClick={hasNextPage ? () => handlePageChange(currentPage + 1) : undefined}
      aria-label="Halaman berikutnya"
    >
      Berikutnya
    </PaginationButton>
  </div>
);

// Desktop Pagination Component
const DesktopPagination: React.FC<{
  currentPage: number;
  totalPages: number;
  pageNumbers: number[];
  showEllipsis: boolean;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  createPageUrl: (page: number) => string;
  handlePageChange: (page: number) => void;
  handlePrevClick: (e: React.MouseEvent) => void;
  handleNextClick: (e: React.MouseEvent) => void;
}> = ({
  currentPage,
  totalPages,
  pageNumbers,
  showEllipsis,
  hasPrevPage,
  hasNextPage,
  createPageUrl,
  handlePageChange,
  handlePrevClick,
  handleNextClick,
}) => (
  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
    <div>
      <p className="text-sm text-gray-700">
        Halaman <span className="font-medium">{currentPage}</span> dari{' '}
        <span className="font-medium">{totalPages}</span>
      </p>
    </div>
    
    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
      {/* Previous Button */}
      <PaginationNavButton
        href={hasPrevPage ? createPageUrl(currentPage - 1) : undefined}
        onClick={hasPrevPage ? handlePrevClick : undefined}
        disabled={!hasPrevPage}
        position="first"
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeftIcon />
      </PaginationNavButton>

      {/* Page Numbers */}
      {pageNumbers.map((page) => (
        <PaginationPageLink
          key={page}
          page={page}
          isActive={currentPage === page}
          href={createPageUrl(page)}
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(page);
          }}
        />
      ))}

      {/* Ellipsis */}
      {showEllipsis && (
        <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
          ...
        </span>
      )}

      {/* Next Button */}
      <PaginationNavButton
        href={hasNextPage ? createPageUrl(currentPage + 1) : undefined}
        onClick={hasNextPage ? handleNextClick : undefined}
        disabled={!hasNextPage}
        position="last"
        aria-label="Halaman berikutnya"
      >
        <ChevronRightIcon />
      </PaginationNavButton>
    </nav>
  </div>
);

// Reusable Pagination Button Component
const PaginationButton: React.FC<{
  children: React.ReactNode;
  variant?: 'outline' | 'default';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
  'aria-label': string;
}> = ({ children, variant = 'default', size = 'md', disabled, href, onClick, ...props }) => {
  const className = cn(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
    {
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
      'h-9 px-4 py-2': size === 'md',
      'h-8 px-3 text-xs': size === 'sm',
      'opacity-50 cursor-not-allowed': disabled,
      'cursor-pointer': !disabled,
    }
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={className} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} disabled={disabled} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

// Reusable Pagination Navigation Button
const PaginationNavButton: React.FC<{
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  position: 'first' | 'last';
  'aria-label': string;
}> = ({ children, href, onClick, disabled, position, ...props }) => {
  const className = cn(
    'relative inline-flex items-center border border-gray-300 px-2 py-2 text-sm font-medium focus:z-20',
    {
      'rounded-l-md': position === 'first',
      'rounded-r-md': position === 'last',
      'bg-white text-gray-500 hover:bg-gray-50': !disabled,
      'bg-white text-gray-300 cursor-not-allowed': disabled,
    }
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={className} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

// Reusable Pagination Page Link
const PaginationPageLink: React.FC<{
  page: number;
  isActive: boolean;
  href: string;
  onClick: (e: React.MouseEvent) => void;
}> = ({ page, isActive, href, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      'relative inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-20',
      {
        'z-10 border-primary bg-primary-50 text-primary': isActive,
        'border-gray-300 bg-white text-gray-500 hover:bg-gray-50': !isActive,
      }
    )}
  >
    {page}
  </Link>
);

// Icon Components
const ChevronLeftIcon: React.FC = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
  </svg>
);

const ChevronRightIcon: React.FC = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
  </svg>
);
export default Pagination;
