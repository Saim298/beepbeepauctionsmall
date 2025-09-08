import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxVisible; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <nav
      aria-label="Page navigation"
      className="d-flex justify-content-center mt-3 mt-md-4"
    >
      <ul className="pagination gap-2 gap-md-3 justify-content-center align-items-center">
        {/* Previous Button */}
        <li className="page-item">
          <button
            className={`page-link rounded-circle transition d-center cus-border border b-fourth previous ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous"
          >
            <span className="d-center bg-transparent fs-six n4-color">
              <i className="ph ph-caret-left"></i>
            </span>
          </button>
        </li>

        {/* Page Numbers */}
        {pages.map(pageNum => (
          <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
            <button
              className="page-link rounded-circle transition d-center cus-border border b-fourth"
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          </li>
        ))}

        {/* Next Button */}
        <li className="page-item">
          <button
            className={`page-link rounded-circle transition d-center cus-border border b-fourth next ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next"
          >
            <span className="d-center bg-transparent fs-six n4-color">
              <i className="ph ph-caret-right"></i>
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
