import React, { useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./styles/Paginacion.css";

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  const buttonRefs = useRef([]);

  useEffect(() => {
    if (buttonRefs.current[currentPage - 1]) {
      buttonRefs.current[currentPage - 1].focus();
    }
  }, [currentPage]);

  const renderPaginationButtons = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          ref={(el) => (buttonRefs.current[i - 1] = el)}
          onClick={() => handlePageChange(i)}
          className={`btn-numero-paginacion ${
            currentPage === i ? "activo" : ""
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div
      className="contenedor_botones_paginacion"
      role="navigation"
      aria-label="Pagination"
    >
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-paginacion"
        aria-label="Previous page"
      >
        <FaChevronLeft />
      </button>

      {renderPaginationButtons()}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-paginacion"
        aria-label="Next page"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
};

export default Pagination;