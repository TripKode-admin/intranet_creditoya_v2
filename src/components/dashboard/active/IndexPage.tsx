"use client"

import useActives from "@/hooks/dashboard/useActives";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

function ActiveIndexPage() {
    const {
        handlePageChange,
        pagination,
        getPageNumbers
    } = useActives();
    
    return (
        <div className="flex justify-center mt-8 mb-4">
            {/* Botón Anterior */}
            <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`flex items-center px-4 py-2 rounded-l-lg border ${pagination.currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                    }`}
            >
                <FiChevronLeft className="mr-2" />
                Anterior
            </button>

            {/* Indicador de página y páginas numéricas */}
            <div className="hidden md:flex">
                {getPageNumbers().map((page, index) => (
                    typeof page === 'number' ? (
                        <button
                            key={`page-${page}`}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 border-t border-b ${pagination.currentPage === page
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                }`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700"
                        >
                            {page}
                        </span>
                    )
                ))}
            </div>

            {/* Indicador móvil simple */}
            <div className="md:hidden flex items-center px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700">
                {pagination.currentPage} / {pagination.totalPages}
            </div>

            {/* Botón Siguiente */}
            <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`flex items-center px-4 py-2 rounded-r-lg border ${pagination.currentPage === pagination.totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                    }`}
            >
                Siguiente
                <FiChevronRight className="ml-2" />
            </button>
        </div>
    )
}

export default ActiveIndexPage