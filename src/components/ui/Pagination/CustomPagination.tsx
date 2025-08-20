interface PaginationProps {
  page: number;
  size: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

export const CustomPagination: React.FC<PaginationProps> = ({
  page,
  size,
  totalElements,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalElements / size);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const maxPagesToShow = 5;
    let start = Math.max(0, page - Math.floor(maxPagesToShow / 2));
    let end = start + maxPagesToShow;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(0, end - maxPagesToShow);
    }

    if (start > 0) {
      pages.push(0);
      if (start > 1) pages.push("...");
    }

    for (let i = start; i < end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages - 1);
    }

    return pages;
  };

  return (
    <div className="d-flex justify-content-between align-items-center p-2">
      {/* Left side - summary */}
      <div>
        Page {page + 1} of {totalPages || 1}
      </div>

      {/* Right side - pagination */}
      <div className="dataTables_paginate paging_simple_numbers">
        <ul className="pagination mb-0">
          {/* First */}
          <li className={`paginate_button page-item ${page === 0 ? "disabled" : ""}`}>
            <a href="#" className="page-link" onClick={() => onPageChange(0)}>
              First
            </a>
          </li>

          {/* Previous */}
          <li className={`paginate_button page-item ${page === 0 ? "disabled" : ""}`}>
            <a href="#" className="page-link" onClick={() => onPageChange(page - 1)}>
              Previous
            </a>
          </li>

          {/* Page Numbers */}
          {getPageNumbers().map((p, idx) =>
            p === "..." ? (
              <li key={idx} className="paginate_button page-item disabled">
                <span className="page-link">…</span>
              </li>
            ) : (
              <li
                key={p}
                className={`paginate_button page-item ${p === page ? "active" : ""}`}
              >
                <a href="#" className="page-link" onClick={() => onPageChange(p)}>
                  {p + 1}
                </a>
              </li>
            )
          )}

          {/* Next */}
          <li className={`paginate_button page-item ${page + 1 >= totalPages ? "disabled" : ""}`}>
            <a href="#" className="page-link" onClick={() => onPageChange(page + 1)}>
              Next
            </a>
          </li>

          {/* Last */}
          <li className={`paginate_button page-item ${page + 1 >= totalPages ? "disabled" : ""}`}>
            <a href="#" className="page-link" onClick={() => onPageChange(totalPages - 1)}>
              Last
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};