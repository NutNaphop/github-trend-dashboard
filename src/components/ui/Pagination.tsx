"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages - 1);
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push(2);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-muted">
            ...
          </span>
        );
      }

      const isActive = page === currentPage;
      return (
        <Link
          key={page}
          href={createPageURL(page)}
          className={`min-w-[36px] h-9 flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-muted hover:text-white hover:bg-white/5"
          }`}
        >
          {page}
        </Link>
      );
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2 sm:space-x-2 mt-8 py-4 w-full">
      <div className="flex items-center justify-between w-full sm:w-auto px-4 sm:px-0">
        {currentPage > 1 ? (
          <Link
            href={createPageURL(currentPage - 1)}
            className="px-3 py-2 text-sm font-medium text-muted hover:text-white transition-colors flex items-center gap-2"
          >
            <div className="w-3.5 h-3.5 bg-gray-500 rounded-sm"></div> Previous
          </Link>
        ) : (
          <span className="px-3 py-2 text-sm font-medium text-gray-600 cursor-not-allowed flex items-center gap-2 opacity-50">
            <div className="w-3.5 h-3.5 bg-gray-600 rounded-sm"></div> Previous
          </span>
        )}

        {/* Mobile Next button (shows on top row with Previous) */}
        <div className="sm:hidden">
          {currentPage < totalPages ? (
            <Link
              href={createPageURL(currentPage + 1)}
              className="px-3 py-2 text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-2"
            >
              Next <div className="w-3.5 h-3.5 bg-blue-500 rounded-sm"></div>
            </Link>
          ) : (
            <span className="px-3 py-2 text-sm font-medium text-gray-600 cursor-not-allowed flex items-center gap-2 opacity-50">
              Next <div className="w-3.5 h-3.5 bg-gray-600 rounded-sm"></div>
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center flex-wrap gap-1 max-w-full px-2">
        {renderPageNumbers()}
      </div>

      {/* Desktop Next button */}
      <div className="hidden sm:block">
        {currentPage < totalPages ? (
          <Link
            href={createPageURL(currentPage + 1)}
            className="px-3 py-2 text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-2"
          >
            Next <div className="w-3.5 h-3.5 bg-blue-500 rounded-sm"></div>
          </Link>
        ) : (
          <span className="px-3 py-2 text-sm font-medium text-gray-600 cursor-not-allowed flex items-center gap-2 opacity-50">
            Next <div className="w-3.5 h-3.5 bg-gray-600 rounded-sm"></div>
          </span>
        )}
      </div>
    </div>
  );
}
