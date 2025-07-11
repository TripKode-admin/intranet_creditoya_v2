"use client";

import CardProof from "@/components/dashboard/proof/CardProof";
import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import useProof from "@/hooks/dashboard/useProof";
import { PiArrowCircleRightBold } from "react-icons/pi";

function ComprobantesPage() {
    const {
        loading,
        error,
        getFullName,
        downloadDocumentById,
        neverDownloadedDocuments,
        handlePageChange,
        pagination,
        isDownloaded,
        handleToggleDownload,
        selectedDocuments,
        toggleDocumentSelection,
        handleDownloadSelected,
        toggleSelectAll,
        goToFirstPage,
        goToLastPage,
        goToNextPage,
        goToPrevPage,
    } = useProof();

    // Verificar si todos los documentos de la página actual están seleccionados
    const currentPageDocumentIds = neverDownloadedDocuments.map(doc => doc.document.id);
    const allCurrentPageSelected = currentPageDocumentIds.length > 0 && currentPageDocumentIds.every(id => selectedDocuments.includes(id));

    if (loading) {
        return (
            <SidebarLayout>
                <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </SidebarLayout>
        );
    }

    if (error) {
        return (
            <SidebarLayout>
                <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        Error: {error}
                    </div>
                </div>
            </SidebarLayout>
        );
    }

    return (
        <SidebarLayout>
            <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen overflow-scroll">
                <header className="mb-8">
                    <h1 className="text-xl sm:text-2xl font-medium text-gray-800">
                        Comprobantes Autogenerados
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Contratos, Comprobantes y documentos autogenerados tras la aprobación de la solicitud de préstamo.
                    </p>
                </header>

                {/* Sección para Descargar documentos */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Documentos Disponibles
                            </h2>
                            <span className="text-sm text-gray-500">
                                ({pagination.total} total)
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            {selectedDocuments.length > 0 && (
                                <button
                                    onClick={handleDownloadSelected}
                                    className="px-3 py-1 text-sm bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                                >
                                    Descargar seleccionados ({selectedDocuments.length})
                                </button>
                            )}
                            <button
                                onClick={handleToggleDownload}
                                disabled={isDownloaded || neverDownloadedDocuments.length === 0}
                                className={`text-sm font-medium transition-colors px-3 py-1 rounded-lg ${isDownloaded || neverDownloadedDocuments.length === 0
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                                    }`}
                            >
                                {isDownloaded ? 'Descargando...' : 'Descargar todos'}
                            </button>
                        </div>
                    </div>

                    {!isDownloaded && neverDownloadedDocuments.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-sm">No hay documentos generados disponibles</p>
                        </div>
                    ) : (
                        <>
                            {/* Selector de todos */}
                            {neverDownloadedDocuments.length > 0 && (
                                <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={allCurrentPageSelected}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label className="text-sm text-gray-700">
                                            Seleccionar todos en esta página
                                        </label>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        Página {pagination.currentPage} de {pagination.totalPages}
                                    </span>
                                </div>
                            )}

                            <div className="space-y-3">
                                {neverDownloadedDocuments.map((docWithLoan) => (
                                    <CardProof
                                        key={docWithLoan.loanApplication.id}
                                        docWithLoan={docWithLoan}
                                        selectedDocuments={selectedDocuments}
                                        toggleDocumentSelection={toggleDocumentSelection}
                                    />
                                ))}
                            </div>

                            {/* Paginación mejorada */}
                            {pagination.totalPages > 1 && (
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={goToFirstPage}
                                                disabled={pagination.currentPage === 1}
                                                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                                            >
                                                Primera
                                            </button>
                                            <button
                                                onClick={goToPrevPage}
                                                disabled={pagination.currentPage === 1}
                                                className="p-2 text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex items-center space-x-1">
                                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (pagination.totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (pagination.currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                                                    pageNum = pagination.totalPages - 4 + i;
                                                } else {
                                                    pageNum = pagination.currentPage - 2 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`w-8 h-8 text-sm rounded-lg transition-colors ${pagination.currentPage === pageNum
                                                            ? 'bg-blue-600 text-white'
                                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={goToNextPage}
                                                disabled={pagination.currentPage === pagination.totalPages}
                                                className="p-2 text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={goToLastPage}
                                                disabled={pagination.currentPage === pagination.totalPages}
                                                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                                            >
                                                Última
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-2 text-center text-sm text-gray-500">
                                        Mostrando {((pagination.currentPage - 1) * pagination.limit) + 1} - {Math.min(pagination.currentPage * pagination.limit, pagination.total)} de {pagination.total} documentos
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {isDownloaded && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-gray-600 font-medium">Descarga completada</p>
                            <p className="text-gray-500 text-sm mt-1">Todos los documentos han sido descargados</p>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}

export default ComprobantesPage;