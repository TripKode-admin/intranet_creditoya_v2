"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import axios from 'axios';
import { ScalarLoanApplication } from '@/types/loan';

interface UsePendingDisbursementParams {
    page?: number;
    pageSize?: number;
    search?: string;
    syncWithUrl?: boolean; // Nuevo parámetro para controlar sincronización con URL
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
    searchQuery: string;
    refetch: () => void;
    setPage: (page: number) => void;
    setSearch: (search: string) => void;
    setPageSize: (size: number) => void;
    disburseLoan: (loanId: string) => Promise<ScalarLoanApplication>;
    resetFilters: () => void;
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
    pageSize = 6,
    search = '',
    syncWithUrl = true
}: UsePendingDisbursementParams = {}): UsePendingDisbursementReturn => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Estados locales
    const [loans, setLoans] = useState<ScalarLoanApplication[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Obtener parámetros de la URL si syncWithUrl está habilitado
    const getUrlParams = useCallback(() => {
        if (!syncWithUrl) {
            return {
                page,
                pageSize,
                search
            };
        }

        const urlPage = parseInt(searchParams.get('page') || '1', 10);
        const urlPageSize = parseInt(searchParams.get('pageSize') || pageSize.toString(), 10);
        const urlSearch = searchParams.get('search') || '';

        return {
            page: urlPage > 0 ? urlPage : 1,
            pageSize: urlPageSize > 0 ? urlPageSize : pageSize,
            search: urlSearch
        };
    }, [searchParams, page, pageSize, search, syncWithUrl]);

    // Estados derivados de URL o parámetros iniciales
    const urlParams = getUrlParams();
    const [currentPage, setCurrentPage] = useState(urlParams.page);
    const [currentPageSize, setCurrentPageSize] = useState(urlParams.pageSize);
    const [searchQuery, setSearchQuery] = useState(urlParams.search);

    // Función para actualizar la URL
    const updateUrl = useCallback((newParams: {
        page?: number;
        pageSize?: number;
        search?: string;
    }) => {
        if (!syncWithUrl) return;

        const params = new URLSearchParams(searchParams);

        // Actualizar parámetros
        if (newParams.page !== undefined) {
            if (newParams.page === 1) {
                params.delete('page'); // Remover page=1 de la URL para URLs más limpias
            } else {
                params.set('page', newParams.page.toString());
            }
        }

        if (newParams.pageSize !== undefined) {
            if (newParams.pageSize === 6) { // Valor por defecto
                params.delete('pageSize');
            } else {
                params.set('pageSize', newParams.pageSize.toString());
            }
        }

        if (newParams.search !== undefined) {
            if (newParams.search === '') {
                params.delete('search');
            } else {
                params.set('search', newParams.search);
            }
        }

        const newUrl = `${pathname}?${params.toString()}`;
        router.push(newUrl, { scroll: false });
    }, [router, pathname, searchParams, syncWithUrl]);

    // Sincronizar estados con URL cuando cambian los searchParams
    useEffect(() => {
        if (!syncWithUrl) return;

        const newParams = getUrlParams();

        // Solo actualizar si hay cambios reales
        if (newParams.page !== currentPage ||
            newParams.pageSize !== currentPageSize ||
            newParams.search !== searchQuery) {

            console.log('🔄 Hook - Syncing with URL params:', newParams);

            setCurrentPage(newParams.page);
            setCurrentPageSize(newParams.pageSize);
            setSearchQuery(newParams.search);
        }
    }, [searchParams, syncWithUrl, getUrlParams, currentPage, currentPageSize, searchQuery]);

    // Funciones para manejar cambios de estado
    const setPage = useCallback((newPage: number) => {
        console.log(`📄 Hook - Changing page to: ${newPage}`);

        // Validar página
        if (newPage < 1) newPage = 1;
        if (totalPages > 0 && newPage > totalPages) newPage = totalPages;

        setCurrentPage(newPage);
        updateUrl({ page: newPage });
    }, [totalPages, updateUrl]);

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

            console.log('🔍 Hook - Fetching with params:', params);

            const response = await apiClient.get<PendingDisbursementResponse>(
                '/api/dash/loan/disbursed',
                { params }
            );

            console.log("✅ Hook - Loans pending disbursed response:", response.data);

            const data = response.data;

            if (!data.success) {
                throw new Error(data.error || 'Error al obtener los préstamos pendientes de desembolso');
            }

            setLoans(data.data || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 0);

            console.log(`✅ Hook - Cargados ${data.data?.length || 0} préstamos pendientes de desembolso`);
            console.log(`📊 Hook - Total: ${data.total}, Páginas: ${data.totalPages}, Página actual: ${currentPage}`);

            // Validar si la página actual es válida
            if (data.totalPages > 0 && currentPage > data.totalPages) {
                console.log('⚠️ Hook - Current page exceeds total pages, redirecting to last page');
                setPage(data.totalPages);
            }

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
            console.error('❌ Hook - Error fetching pending disbursement loans:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, currentPageSize, searchQuery, setPage]);

    // Effect para cargar datos cuando cambian los parámetros
    useEffect(() => {
        // Debounce para búsqueda
        const timeoutId = setTimeout(() => {
            fetchPendingDisbursement();
        }, searchQuery ? 300 : 0); // 300ms de debounce para búsqueda, inmediato para otros cambios

        return () => clearTimeout(timeoutId);
    }, [fetchPendingDisbursement, searchQuery]);

    const refetch = useCallback(() => {
        fetchPendingDisbursement();
    }, [fetchPendingDisbursement]);

    const setSearch = useCallback((newSearch: string) => {
        console.log(`🔍 Hook - Changing search to: "${newSearch}"`);

        setSearchQuery(newSearch);
        setCurrentPage(1); // Reset to first page when searching
        updateUrl({ search: newSearch, page: 1 });
    }, [updateUrl]);

    const setPageSize = useCallback((newSize: number) => {
        console.log(`📏 Hook - Changing page size to: ${newSize}`);

        // Validar pageSize
        if (newSize < 1) newSize = 6;
        if (newSize > 100) newSize = 100; // Límite máximo razonable

        setCurrentPageSize(newSize);
        setCurrentPage(1); // Reset to first page when changing page size
        updateUrl({ pageSize: newSize, page: 1 });
    }, [updateUrl]);

    // Función para resetear todos los filtros
    const resetFilters = useCallback(() => {
        console.log('🔄 Hook - Resetting all filters');

        setCurrentPage(1);
        setCurrentPageSize(6);
        setSearchQuery('');

        if (syncWithUrl) {
            router.push(pathname, { scroll: false });
        }
    }, [router, pathname, syncWithUrl]);

    // Función para desembolsar un préstamo
    const disburseLoan = useCallback(async (loanId: string): Promise<ScalarLoanApplication> => {
        try {
            console.log('💰 Hook - Disbursing loan:', loanId);

            const response = await apiClient.put(`/api/dash/loan/${loanId}/disburse`);

            console.log('✅ Hook - Disburse response:', response.data);

            // Actualizar la lista después del desembolso exitoso
            await fetchPendingDisbursement();

            return response.data;
        } catch (err) {
            let errorMessage = 'Error al desembolsar el préstamo';

            if (axios.isAxiosError(err)) {
                console.error('❌ Hook - Disburse error details:', {
                    status: err.response?.status,
                    statusText: err.response?.statusText,
                    data: err.response?.data
                });

                if (err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response?.data?.error) {
                    errorMessage = err.response.data.error;
                } else if (err.response?.statusText) {
                    errorMessage = `Error ${err.response.status}: ${err.response.statusText}`;
                }
            }

            console.error('❌ Hook - Error disbursing loan:', err);
            throw new Error(errorMessage);
        }
    }, [fetchPendingDisbursement]);

    // Memoizar el objeto de retorno para evitar re-renders innecesarios
    const returnValue = useMemo(() => ({
        loans,
        loading,
        error,
        total,
        totalPages,
        currentPage,
        pageSize: currentPageSize,
        searchQuery,
        refetch,
        setPage,
        setSearch,
        setPageSize,
        disburseLoan,
        resetFilters,
    }), [
        loans,
        loading,
        error,
        total,
        totalPages,
        currentPage,
        currentPageSize,
        searchQuery,
        refetch,
        setPage,
        setSearch,
        setPageSize,
        disburseLoan,
        resetFilters,
    ]);

    return returnValue;
};