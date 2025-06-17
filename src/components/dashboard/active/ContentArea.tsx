"use client"

import useActives from "@/hooks/dashboard/useActives"
import CardLoanState from "./CardLoanState"
import ActiveIndexPage from "./IndexPage"

function ContentActivePage() {
    const {
        error,
        isLoading,
        loanData,
        formatCurrency,
        formatDate,
        handlePageChange,
        pagination,
        getPageNumbers,
        searchQuery
    } = useActives();

    return (
        <div className="py-4">
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-red-500 mb-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 opacity-40"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <p className="text-gray-500 font-medium text-center">{error}</p>
                </div>
            ) : loanData.length > 0 ? (
                <>
                    <div className="space-y-4">
                        {loanData.map((item, index) => (
                            <CardLoanState
                                key={index}
                                item={item}
                                formatCurrency={formatCurrency}
                                formatDate={formatDate}
                            />
                        ))}
                    </div>

                    <ActiveIndexPage />
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-gray-400 mb-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 opacity-40"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <p className="text-gray-500 font-medium text-center">
                        No hay solicitudes en este estado
                    </p>
                    <p className="text-gray-400 text-sm text-center mt-1">
                        {searchQuery
                            ? 'No se encontraron resultados para tu búsqueda'
                            : 'Las solicitudes aparecerán aquí cuando estén disponibles'}
                    </p>
                </div>
            )}
        </div>
    )
}

export default ContentActivePage