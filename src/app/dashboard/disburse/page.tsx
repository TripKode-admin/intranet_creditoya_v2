"use client"

import React, { useState, useEffect } from 'react';
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
    Clock
} from 'lucide-react';
import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import { ScalarLoanApplication } from '@/types/loan';
import { useRouter } from 'next/navigation';
import { handleKeyToStringBank } from '@/handlers/typeBank';
import Image from 'next/image';
import { usePendingDisbursement } from '@/hooks/dashboard/useDisbursed';

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
            currency: 'COP'
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
                        {loan.loanApplication?.status}
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
                        {formatCurrency(loan.loanApplication?.cantity || '0')}
                    </p>
                </div>
                <div className="text-center sm:text-left">
                    <p className="text-sm text-gray-500 mb-1">Entidad bancaria</p>
                    <p className="font-medium text-gray-900 truncate" title={loan.loanApplication?.entity}>
                        {handleKeyToStringBank(loan.loanApplication?.entity)}
                    </p>
                </div>
                <div className="text-center sm:text-left">
                    <p className="text-sm text-gray-500 mb-1">Fecha de aprobación</p>
                    <p className="font-medium text-gray-900">
                        {formatDate(loan.loanApplication?.created_at)}
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
                    onClick={() => router.push(`/dashboard/loan/${loan.loanApplication?.id}?user_id=${loan.userId}`)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                    <Info className="w-4 h-4" />
                    <span>Ver información</span>
                </button>
            </div>
        </div>
    );
};

// Componente de Paginación
const Pagination = ({
    currentPage,
    totalPages,
    onPageChange
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) => {
    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots.filter((page, index, array) => array.indexOf(page) === index);
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {getVisiblePages().map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={page === '...'}
                    className={`px-2 sm:px-3 py-2 rounded-lg text-sm font-medium transition-colors ${page === currentPage
                        ? 'bg-blue-600 text-white'
                        : page === '...'
                            ? 'cursor-default'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
        </div>
    );
};

function DisbursePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [disbursementStates, setDisbursementStates] = useState<Record<string, boolean>>({});
    const [processingStates, setProcessingStates] = useState<Record<string, boolean>>({});
    const [successMessage, setSuccessMessage] = useState<string>('');

    const {
        loans,
        loading,
        error,
        total,
        totalPages,
        currentPage,
        pageSize,
        setPage,
        setSearch,
        setPageSize,
        // handlerIsDisbursed,
        disburseLoan,
        refetch
    } = usePendingDisbursement({
        page: 1,
        pageSize: 6,
        search: ''
    });

    const handleSearch = (e?: React.KeyboardEvent | React.MouseEvent) => {
        if (e) e.preventDefault();
        setSearch(searchTerm);
    };

    const handleDisburse = async (loan: ScalarLoanApplication) => {
        if (!loan.loanApplication?.id) {
            alert('Error: ID del préstamo no encontrado');
            return;
        }

        const loanId = loan.loanApplication.id;

        // Mostrar confirmación
        const isConfirmed = window.confirm(
            `¿Estás seguro de que deseas confirmar el desembolso para ${loan.user?.names} ${loan.user?.firstLastName}?\n\nMonto: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(loan.loanApplication?.cantity || '0'))}`
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
                                onKeyDownCapture={(e) => e.key === 'Enter' && handleSearch(e)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <select
                                value={pageSize}
                                onChange={(e) => setPageSize(Number(e.target.value))}
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
                        </div>
                    </div>
                </div>

                {/* Información de resultados */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
                    <p className="text-sm text-gray-600">
                        Mostrando {loans.length} de {total} préstamos aprobados
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
                                        No hay préstamos aprobados que coincidan con tu búsqueda.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:gap-6">
                                {loans.map((loan) => (
                                    <LoanCard
                                        key={loan.loanApplication?.id}
                                        loan={loan}
                                        onDisburse={handleDisburse}
                                        isDisbursed={disbursementStates[loan.loanApplication?.id || ''] || false}
                                        isProcessing={processingStates[loan.loanApplication?.id || ''] || false}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Paginación */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>
        </SidebarLayout>
    );
}

export default DisbursePage;