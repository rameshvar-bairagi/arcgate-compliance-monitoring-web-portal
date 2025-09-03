interface PaginationProps {
  page: number; // now 1-based (default 1)
  size: number;
  totalElements: number;
  onPageChange: (page: number) => void; // will always receive 1-based page
}

export const CustomPagination: React.FC<PaginationProps> = ({
  page,
  size,
  totalElements,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalElements / size));

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const maxPagesToShow = 5;
    let start = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let end = start + maxPagesToShow - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="d-flex justify-content-between align-items-center p-2">
      {/* Left side - summary */}
      <div>
        Page {page === 0 ? 1 : page} of {totalPages}
      </div>

      {/* Right side - pagination */}
      <div className="dataTables_paginate paging_simple_numbers">
        <ul className="pagination mb-0">
          {/* First */}
          <li className={`paginate_button page-item ${page === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(1)}>
              «
            </button>
          </li>

          {/* Previous */}
          <li className={`paginate_button page-item ${page === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(page - 1)}>
              ‹
            </button>
          </li>

          {/* Page Numbers */}
          {getPageNumbers().map((p, idx) =>
            p === "..." ? (
              <li key={idx} className="paginate_button page-item disabled">
                <span className="page-link">…</span>
              </li>
            ) : (
              <li
                key={idx}
                className={`paginate_button page-item ${p === page ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => onPageChange(p)}>
                  {p}
                </button>
              </li>
            )
          )}

          {/* Next */}
          <li className={`paginate_button page-item ${page >= totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(page + 1)}>
              ›
            </button>
          </li>

          {/* Last */}
          <li className={`paginate_button page-item ${page >= totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(totalPages)}>
              »
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};