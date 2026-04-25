import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

const getPageNumbers = (current: number, total: number): (number | null)[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, null, total];
  if (current >= total - 3) return [1, null, total - 4, total - 3, total - 2, total - 1, total];
  return [1, null, current - 1, current, current + 1, null, total];
};

const Pagination = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1 && !pageSizeOptions) return null;

  const from = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const to = Math.min(currentPage * pageSize, totalItems);
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="pagination-bar">
      <span className="pagination-info">
        Showing <strong>{from}–{to}</strong> of <strong>{totalItems}</strong>
      </span>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="page-btn page-btn-nav"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {pages.map((page, i) =>
            page === null ? (
              <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
            ) : (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          )}

          <button
            className="page-btn page-btn-nav"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {onPageSizeChange && pageSizeOptions && (
        <label className="page-size-selector">
          <span>Per page</span>
          <select value={pageSize} onChange={e => { onPageSizeChange(Number(e.target.value)); onPageChange(1); }}>
            {pageSizeOptions.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
};

export default Pagination;
