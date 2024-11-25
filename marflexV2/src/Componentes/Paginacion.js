import React, { useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './styles/Paginacion.css';

const Paginacion = ({ currentPage, totalPages, handlePageChange }) => {
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
          className={`btn-numero-paginacion ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} `}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="contenedor_botones_paginacion" role="navigation" aria-label="Pagination">
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

export default Paginacion;
