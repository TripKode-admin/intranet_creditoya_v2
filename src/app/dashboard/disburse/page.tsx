"use client"

import React, { Suspense, useState } from 'react';
import {
    CreditCard,
    AlertCircle,
    Loader2,
    Search,
    CheckCircle,
} from 'lucide-react';
import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import { ScalarLoanApplication } from '@/types/loan';
import { usePendingDisbursement } from '@/hooks/dashboard/useDisbursed';
import LoanCard from '@/components/dashboard/disbursed/LoanCard';
import Pagination from '@/components/dashboard/disbursed/Pagination';

function DisbursePageLoading() {
    return (
        <SidebarLayout>
            <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Cargando</span>
                </div>
            </div>
        </SidebarLayout>
    );
}


function PreDisbursePage() {
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

function DisbursePage() {
    return (
        <Suspense fallback={<DisbursePageLoading />}>
            <PreDisbursePage />
        </Suspense>
    )
}

export default DisbursePage;