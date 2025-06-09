"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { ScalarLoanApplication } from '@/types/loan';

interface UsePendingDisbursementParams {
    page?: number;
    pageSize?: number;
    search?: string;
}

interface PendingDisbursementResponse {
    success: boolean;
    data: ScalarLoanApplication[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    status: string;
    error?: string;
}

interface UsePendingDisbursementReturn {
    loans: ScalarLoanApplication[];
    loading: boolean;
    error: string | null;
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    refetch: () => void;
    setPage: (page: number) => void;
    setSearch: (search: string) => void;
    setPageSize: (size: number) => void;
    disburseLoan: (loanId: string) => Promise<ScalarLoanApplication>;
}

// Configurar axios con credenciales por defecto
const apiClient = axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 segundos de timeout
});

export const usePendingDisbursement = ({
    page = 1,
    pageSize = 10,
    search = ''
}: UsePendingDisbursementParams = {}): UsePendingDisbursementReturn => {
    const [loans, setLoans] = useState<ScalarLoanApplication[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(page);
    const [currentPageSize, setCurrentPageSize] = useState(pageSize);
    const [searchQuery, setSearchQuery] = useState(search);

    // Función para obtener préstamos pendientes de desembolso
    const fetchPendingDisbursement = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = {
                page: currentPage.toString(),
                pageSize: currentPageSize.toString(),
                ...(searchQuery && { search: searchQuery }),
            };

            const response = await apiClient.get<PendingDisbursementResponse>(
                '/api/dash/loan/disbursed',
                { params }
            );

            const data = response.data;

            if (!data.success) {
                throw new Error(data.error || 'Error al obtener los préstamos pendientes de desembolso');
            }

            setLoans(data.data || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 0);

            console.log(`✅ Cargados ${data.data?.length || 0} préstamos pendientes de desembolso`);
        } catch (err) {
            let errorMessage = 'Error desconocido';

            if (axios.isAxiosError(err)) {
                if (err.code === 'ECONNABORTED') {
                    errorMessage = 'Tiempo de espera agotado. Intenta de nuevo.';
                } else if (err.response?.status === 404) {
                    errorMessage = 'Endpoint no encontrado. Verifica que la ruta esté configurada correctamente.';
                } else if (err.response?.data?.error) {
                    errorMessage = err.response.data.error;
                } else if (err.response?.statusText) {
                    errorMessage = `Error ${err.response.status}: ${err.response.statusText}`;
                } else {
                    errorMessage = err.message;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            console.error('❌ Error fetching pending disbursement loans:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, currentPageSize, searchQuery]);

    // Effect para cargar datos cuando cambian los parámetros
    useEffect(() => {
        fetchPendingDisbursement();
    }, [fetchPendingDisbursement]);

    const refetch = useCallback(() => {
        fetchPendingDisbursement();
    }, [fetchPendingDisbursement]);

    const setPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const setSearch = useCallback((search: string) => {
        setSearchQuery(search);
        setCurrentPage(1); // Reset to first page when searching
    }, []);

    const setPageSize = useCallback((size: number) => {
        setCurrentPageSize(size);
        setCurrentPage(1); // Reset to first page when changing page size
    }, []);

    // Función para desembolsar un préstamo
    const disburseLoan = useCallback(async (loanId: string): Promise<ScalarLoanApplication> => {
        try {
            console.log('🔍 Disbursing loan:', loanId);

            const response = await apiClient.put(`/api/dash/loan/${loanId}/disburse`);

            console.log('✅ Disburse response:', response.data);

            // Actualizar la lista después del desembolso exitoso
            await fetchPendingDisbursement();

            return response.data;
        } catch (err) {
            let errorMessage = 'Error al desembolsar el préstamo';

            if (axios.isAxiosError(err)) {
                console.error('❌ Disburse error details:', {
                    status: err.response?.status,
                    statusText: err.response?.statusText,
                    data: err.response?.data
                });

                if (err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response?.statusText) {
                    errorMessage = `Error ${err.response.status}: ${err.response.statusText}`;
                }
            }

            console.error('❌ Error disbursing loan:', err);
            throw new Error(errorMessage);
        }
    }, [fetchPendingDisbursement]);

    // Memoizar el objeto de retorno
    const returnValue = useMemo(() => ({
        loans,
        loading,
        error,
        total,
        totalPages,
        currentPage,
        pageSize: currentPageSize,
        refetch,
        setPage,
        setSearch,
        setPageSize,
        disburseLoan,
    }), [
        loans,
        loading,
        error,
        total,
        totalPages,
        currentPage,
        currentPageSize,
        refetch,
        setPage,
        setSearch,
        setPageSize,
        disburseLoan,
    ]);

    return returnValue;
};