"use client";

import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import useProof from "@/hooks/dashboard/useProof";
import { PiArrowCircleRightBold } from "react-icons/pi";

function ComprobantesPage() {
    const {
        getFullName,
        downloadDocumentById,
        eligibleDocuments,
        paginatedDocuments,
        handlePageChange,
        currentPage,
        itemsPerPage,
        isDownloaded,
        handleToggleDownload
    } = useProof();

    console.log(eligibleDocuments)

    return (
        <SidebarLayout>
            <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen overflow-scroll">
                <header className="mb-8">
                    <h1 className="text-xl sm:text-2xl font-medium text-gray-800">
                        Comprobantes Autogenerados
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Contratos, Comprobantes y documentos autogenerados tras la aprobación de la solicitud de prestamo.
                    </p>
                </header>

                {/* Sección para Descargar ZIP */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Documentos Disponibles
                        </h2>
                        <button
                            onClick={handleToggleDownload}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            Descargar todos
                        </button>
                    </div>

                    {isDownloaded == false && eligibleDocuments.length === 0 ? (
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
                            <div className="space-y-3">
                                {paginatedDocuments.map((docWithLoan) => (
                                    <div
                                        key={docWithLoan.document.id}
                                        className={`flex items-center justify-between p-4 rounded-lg border transition-all ${docWithLoan.downloadCount === 0
                                            ? 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                            : 'border-gray-100 bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-2 h-2 rounded-full ${docWithLoan.downloadCount === 0 ? 'bg-green-400' : 'bg-gray-300'
                                                }`}></div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">
                                                    {getFullName(docWithLoan.loanApplication.user)}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Solicitud: {docWithLoan.loanApplication.id}
                                                </p>
                                                <div className="flex flex-row justify-between mt-2 px-2 py-1 border border-gray-200 bg-gray-100 rounded-lg cursor-pointer">
                                                    <p className="text-xs text-gray-500">Ver solicitud</p>
                                                    <div className="grid place-content-center">
                                                        <PiArrowCircleRightBold className="text-gray-500" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <button
                                                onClick={() => downloadDocumentById(docWithLoan.document.id)}
                                                disabled={docWithLoan.downloadCount !== 0}
                                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${docWithLoan.downloadCount === 0
                                                    ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    }`}
                                            >
                                                {docWithLoan.downloadCount === 0 ? 'Descargar' : 'Descargado'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Paginación minimalista */}
                            {Math.ceil(eligibleDocuments.length / itemsPerPage) > 1 && (
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-center space-x-1">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="p-2 text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>

                                        <div className="flex items-center space-x-1">
                                            {Array.from({ length: Math.ceil(eligibleDocuments.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`w-8 h-8 text-sm rounded-lg transition-colors ${currentPage === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage * itemsPerPage >= eligibleDocuments.length}
                                            className="p-2 text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {isDownloaded == true && (
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