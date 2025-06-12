import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    loading?: boolean;
    showInfo?: boolean;
    showPageSizeSelector?: boolean;
    pageSize?: number;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
    total?: number;
    className?: string;
}

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    loading = false,
    showInfo = true,
    showPageSizeSelector = false,
    pageSize = 6,
    onPageSizeChange,
    pageSizeOptions = [6, 12, 24, 48],
    total = 0,
    className = ""
}: PaginationProps) => {
    const [isClient, setIsClient] = useState(false);

    // Efecto para detectar si estamos en el cliente (hidratación)
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Función optimizada para obtener páginas visibles
    const getVisiblePages = useCallback(() => {
        if (totalPages <= 1) return [];

        // Responsive delta basado en viewport
        const delta = !isClient || window.innerWidth < 640 ? 1 : 2;
        const range = [];
        const rangeWithDots = [];

        const start = Math.max(2, currentPage - delta);
        const end = Math.min(totalPages - 1, currentPage + delta);

        // Construir rango de páginas centrales
        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        // Siempre incluir primera página
        if (totalPages > 1) {
            rangeWithDots.push(1);
        }

        // Agregar dots si hay gap después de la primera página
        if (start > 2) {
            rangeWithDots.push('...');
        }

        // Agregar páginas centrales (excluyendo la primera si ya está incluida)
        range.forEach(page => {
            if (page !== 1) {
                rangeWithDots.push(page);
            }
        });

        // Agregar dots si hay gap antes de la última página
        if (end < totalPages - 1) {
            rangeWithDots.push('...');
        }

        // Siempre incluir última página (si no está ya incluida)
        if (totalPages > 1 && !rangeWithDots.includes(totalPages)) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    }, [currentPage, totalPages, isClient]);

    // Memoizar páginas visibles
    const visiblePages = useMemo(() => getVisiblePages(), [getVisiblePages]);

    // Handlers optimizados
    const handlePreviousPage = useCallback(() => {
        if (currentPage > 1 && !loading) {
            onPageChange(currentPage - 1);
        }
    }, [currentPage, loading, onPageChange]);

    const handleNextPage = useCallback(() => {
        if (currentPage < totalPages && !loading) {
            onPageChange(currentPage + 1);
        }
    }, [currentPage, totalPages, loading, onPageChange]);

    const handlePageClick = useCallback((page: number | string) => {
        if (typeof page === 'number' && page !== currentPage && !loading) {
            onPageChange(page);
        }
    }, [currentPage, loading, onPageChange]);

    const handlePageSizeChange = useCallback((newSize: number) => {
        if (onPageSizeChange && newSize !== pageSize && !loading) {
            console.log(`📏 Pagination - Changing page size to: ${newSize}`);
            onPageSizeChange(newSize);
        }
    }, [onPageSizeChange, pageSize, loading]);

    // Función para calcular el rango de elementos mostrados
    const getItemRange = useCallback(() => {
        if (total === 0) return { start: 0, end: 0 };

        const start = (currentPage - 1) * pageSize + 1;
        const end = Math.min(currentPage * pageSize, total);
        return { start, end };
    }, [currentPage, pageSize, total]);

    const itemRange = getItemRange();

    // No renderizar si no hay páginas o solo hay una
    if (totalPages <= 1) return null;

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 ${className}`}>
            {/* Información de página y elementos (lado izquierdo) */}
            {showInfo && (
                <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-gray-600">
                    <div className="hidden sm:block">
                        Página {currentPage} de {totalPages}
                    </div>
                    {total > 0 && (
                        <div className="text-xs sm:text-sm">
                            Mostrando {itemRange.start}-{itemRange.end} de {total} elementos
                        </div>
                    )}
                </div>
            )}

            {/* Controles de paginación (centro) */}
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                {/* Botón Anterior */}
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1 || loading}
                    className="flex items-center justify-center p-2 sm:px-3 sm:py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                    title="Página anterior"
                    aria-label="Ir a página anterior"
                >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline ml-1">Anterior</span>
                </button>

                {/* Números de página */}
                <div className="flex items-center space-x-1">
                    {visiblePages.map((page, index) => {
                        const isCurrentPage = page === currentPage;
                        const isDots = page === '...';

                        return (
                            <button
                                key={`page-${index}-${page}`}
                                onClick={() => handlePageClick(page)}
                                disabled={isDots || loading}
                                className={`
                                    min-w-[2.5rem] h-10 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                    ${isCurrentPage
                                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600 ring-opacity-50'
                                        : isDots
                                            ? 'cursor-default text-gray-400 hover:bg-transparent'
                                            : 'border border-gray-300 hover:bg-gray-50 text-gray-700 hover:border-gray-400 hover:shadow-sm'
                                    }
                                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                                title={typeof page === 'number' ? `Ir a página ${page}` : undefined}
                                aria-label={typeof page === 'number' ? `Ir a página ${page}` : undefined}
                                aria-current={isCurrentPage ? 'page' : undefined}
                            >
                                {isDots ? <MoreHorizontal className="w-4 h-4" /> : page}
                            </button>
                        );
                    })}
                </div>

                {/* Botón Siguiente */}
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || loading}
                    className="flex items-center justify-center p-2 sm:px-3 sm:py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                    title="Página siguiente"
                    aria-label="Ir a página siguiente"
                >
                    <span className="hidden sm:inline mr-1">Siguiente</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>

            {/* Selector de tamaño de página (lado derecho) */}
            {showPageSizeSelector && onPageSizeChange && (
                <div className="flex items-center gap-2 text-sm">
                    <label htmlFor="pageSize" className="text-gray-600 whitespace-nowrap">
                        Por página:
                    </label>
                    <select
                        id="pageSize"
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        disabled={loading}
                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Seleccionar número de elementos por página"
                    >
                        {pageSizeOptions.map(size => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Información mobile (solo en pantallas pequeñas) */}
            <div className="sm:hidden text-sm text-gray-600">
                {currentPage} / {totalPages}
            </div>

            {/* Indicador de carga */}
            {loading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Cargando...
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pagination