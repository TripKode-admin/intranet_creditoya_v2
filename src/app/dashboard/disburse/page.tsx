"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    User,
    CreditCard,
    Info,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    Loader2,
    Search,
    CheckCircle,
    Clock,
    MoreHorizontal
} from 'lucide-react';
import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import { ScalarLoanApplication } from '@/types/loan';
import { useRouter } from 'next/navigation';
import { BankTypes, handleKeyToStringBank } from '@/handlers/typeBank';
import Image from 'next/image';
import { usePendingDisbursement } from '@/hooks/dashboard/useDisbursed';

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

// Componente de Card para cada préstamo
const LoanCard = ({
    loan,
    onDisburse,
    isDisbursed,
    isProcessing
}: {
    loan: ScalarLoanApplication;
    onDisburse: (loan: ScalarLoanApplication) => void;
    isDisbursed: boolean;
    isProcessing: boolean;
}) => {
    const router = useRouter();
    console.log("Loan: ", loan)

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Number(amount));
    };


    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
            {/* Header con nombre y estado */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                        {loan.user?.avatar && loan.user?.avatar !== "No definido" && loan.user?.avatar !== "" ? (
                            <Image
                                src={loan.user.avatar}
                                alt={`${loan.user?.names} ${loan.user?.firstLastName}`}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <User className="w-5 h-5 text-blue-600" />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                            {loan.user?.names} {loan.user?.firstLastName} {loan.user?.secondLastName}
                        </h3>
                        {/* Indicador de estado de desembolso */}
                        {isDisbursed && (
                            <div className="flex items-center space-x-1 mt-1">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-600 font-medium">Desembolsado</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 self-start">
                        {loan.status}
                    </span>
                    {isDisbursed && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 self-start">
                            Fondos transferidos
                        </span>
                    )}
                </div>
            </div>

            {/* Grid responsivo con 3 datos principales */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="text-center sm:text-left">
                    <p className="text-sm text-gray-500 mb-1">Monto aprobado</p>
                    <p className="font-semibold text-lg text-gray-900">
                        {formatCurrency(
                            loan.reasonChangeCantity && loan.newCantity
                                ? loan.newCantity
                                : loan.cantity || '0'
                        )}
                    </p>
                </div>

                <div className="text-center sm:text-left">
                    <p className="text-sm text-gray-500 mb-1">Entidad bancaria</p>
                    <p className="font-medium text-gray-900 truncate" title={loan.entity}>
                        {handleKeyToStringBank(loan.entity as BankTypes)}
                    </p>
                </div>
                <div className="text-center sm:text-left">
                    <p className="text-sm text-gray-500 mb-1">Fecha de aprobación</p>
                    <p className="font-medium text-gray-900">
                        {formatDate(loan.created_at)}
                    </p>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                <button
                    onClick={() => onDisburse(loan)}
                    disabled={isDisbursed || isProcessing}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${isDisbursed
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : isProcessing
                            ? 'bg-yellow-100 text-yellow-800 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Procesando...</span>
                        </>
                    ) : isDisbursed ? (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Ya desembolsado</span>
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-4 h-4" />
                            <span>Confirmar desembolso</span>
                        </>
                    )}
                </button>
                <button
                    onClick={() => router.push(`/dashboard/loan/${loan.id}?userId=${loan.userId}`)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                    <Info className="w-4 h-4" />
                    <span>Ver información</span>
                </button>
            </div>
        </div>
    );
};

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

function DisbursePage() {
    // Estados locales para la UI
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPageSize, setCurrentPageSize] = useState(6);
    const [disbursementStates, setDisbursementStates] = useState<Record<string, boolean>>({});
    const [processingStates, setProcessingStates] = useState<Record<string, boolean>>({});
    const [successMessage, setSuccessMessage] = useState<string>('');

    // Estados para controlar las actualizaciones del hook
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Hook con valores dinámicos
    const {
        loans,
        loading,
        error,
        total,
        totalPages,
        setPage,
        setSearch,
        setPageSize,
        disburseLoan,
        refetch
    } = usePendingDisbursement({
        page: currentPage,
        pageSize: currentPageSize,
        search: searchQuery
    });

    // Manejar búsqueda
    const handleSearch = (e?: React.KeyboardEvent | React.MouseEvent) => {
        if (e) e.preventDefault();
        setSearchQuery(searchTerm.trim());
        setCurrentPage(1); // Reset página al buscar
        setPage(1);
        setSearch(searchTerm.trim());
    };

    // Manejar cambio de página
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setPage(page);
    };

    // Manejar cambio de tamaño de página
    const handlePageSizeChange = (size: number) => {
        setCurrentPageSize(size);
        setCurrentPage(1); // Reset página al cambiar tamaño
        setPage(1);
        setPageSize(size);
    };

    // Limpiar búsqueda
    const handleClearSearch = () => {
        setSearchTerm('');
        setSearchQuery('');
        setCurrentPage(1);
        setPage(1);
        setSearch('');
    };

    const handleDisburse = async (loan: ScalarLoanApplication) => {
        if (!loan.id) {
            alert('Error: ID del préstamo no encontrado');
            return;
        }

        const loanId = loan.id;

        // Mostrar confirmación
        const isConfirmed = window.confirm(
            `¿Estás seguro de que deseas confirmar el desembolso para ${loan.user?.names} ${loan.user?.firstLastName}?\n\nMonto: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(loan.cantity || '0'))}`
        );

        if (!isConfirmed) return;

        // Marcar como en proceso
        setProcessingStates(prev => ({ ...prev, [loanId]: true }));

        try {
            // Llamar a la función para desembolsar
            await disburseLoan(loanId);

            // Actualizar el estado local
            setDisbursementStates(prev => ({ ...prev, [loanId]: true }));

            // Mostrar mensaje de éxito
            setSuccessMessage(`Desembolso confirmado exitosamente para ${loan.user?.names} ${loan.user?.firstLastName}`);

            // Limpiar el mensaje después de 5 segundos
            setTimeout(() => setSuccessMessage(''), 5000);

        } catch (error) {
            console.error('Error al desembolsar préstamo:', error);
            alert(`Error al confirmar el desembolso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            // Quitar el estado de procesamiento
            setProcessingStates(prev => ({ ...prev, [loanId]: false }));
        }
    };

    return (
        <SidebarLayout>
            <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen overflow-scroll">
                <header className="mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl font-medium text-gray-800">
                        Confirmación de desembolso
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Notifica al cliente sobre la transferencia exitosa de los fondos a su cuenta bancaria registrada
                    </p>
                </header>

                {/* Mensaje de éxito */}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-green-700">{successMessage}</span>
                        </div>
                    </div>
                )}

                {/* Barra de búsqueda y filtros */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, documento o entidad..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <select
                                value={currentPageSize}
                                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value={6}>6 por página</option>
                                <option value={12}>12 por página</option>
                                <option value={24}>24 por página</option>
                            </select>
                            <button
                                onClick={handleSearch}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                            >
                                Buscar
                            </button>
                            {searchQuery && (
                                <button
                                    onClick={handleClearSearch}
                                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Información de resultados */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
                    <p className="text-sm text-gray-600">
                        Mostrando {loans.length} de {total} préstamos aprobados
                        {searchQuery && ` (filtrado por: "${searchQuery}")`}
                    </p>
                    <button
                        onClick={refetch}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Actualizar lista
                    </button>
                </div>

                {/* Estados de carga y error */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Cargando préstamos...</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                            <span className="text-red-700">{error}</span>
                        </div>
                    </div>
                )}

                {/* Grid de tarjetas */}
                {!loading && !error && (
                    <>
                        {loans.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                <div className="max-w-sm mx-auto px-4">
                                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No se encontraron préstamos
                                    </h3>
                                    <p className="text-gray-500">
                                        {searchQuery
                                            ? `No hay préstamos que coincidan con "${searchQuery}"`
                                            : "No hay préstamos aprobados pendientes de desembolso."
                                        }
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:gap-6">
                                {loans.map((loan) => (
                                    <LoanCard
                                        key={loan.id}
                                        loan={loan}
                                        onDisburse={handleDisburse}
                                        isDisbursed={loan.id ? disbursementStates[loan.id] || false : false}
                                        isProcessing={loan.id ? processingStates[loan.id] || false : false}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Paginación */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </SidebarLayout>
    );
}

export default DisbursePage;