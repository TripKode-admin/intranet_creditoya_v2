import { BankTypes, handleKeyToStringBank } from "@/handlers/typeBank";
import useClient from "@/hooks/dashboard/useClients";

function ListLoansClient({ params }: { params: Promise<{ client_id: string }> }) {
    const {
        editableData,
    } = useClient({ params });

    return (
        <div className="mt-20">
            <header className="mb-8">
                <h1 className="text-xl sm:text-2xl font-medium text-gray-800">Historial de solicitudes</h1>
            </header>

            <div className="flex flex-col gap-3">
                {editableData?.LoanApplication && editableData.LoanApplication.length > 0 ? editableData.LoanApplication.map(loan => (
                    <div key={loan.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow transition-all flex flex-col h-full">
                        {/* Header with ID and status */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-700">#{loan.id?.substring(0, 6)}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${loan.status === "Aprobado" ? "bg-green-100 text-green-800" :
                                loan.status === "Pendiente" ? "bg-yellow-100 text-yellow-800" :
                                    loan.status === "Aplazado" ? "bg-orange-100 text-orange-800" :
                                        loan.status === "Borrador" ? "bg-gray-100 text-gray-800" :
                                            loan.status === "Archivado" ? "bg-red-100 text-red-800" :
                                                loan.status === "New-cantity" ? "bg-blue-100 text-blue-800" : ""
                                }`}>
                                {loan.status}
                            </span>
                        </div>

                        {/* Loan details */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm mb-3">
                            <div>
                                <p className="text-xs text-gray-500">Cantidad</p>
                                <p className="text-sm font-medium">${loan.cantity?.toLocaleString()}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Entidad</p>
                                <p className="text-sm">{handleKeyToStringBank(loan.entity as BankTypes)}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Cuenta</p>
                                <p className="text-sm">{loan.bankNumberAccount?.substring(0, 4)}****{loan.bankNumberAccount?.slice(-4)}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Fecha</p>
                                <p className="text-sm">{new Date(loan.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Documents and action button - at the bottom with mt-auto */}
                        <div className="mt-auto">
                            <div className="flex items-center gap-1 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-xs text-gray-500">
                                    {Array.isArray(loan.GeneratedDocuments) && loan.GeneratedDocuments.length > 0 && Array.isArray(loan.GeneratedDocuments[0]?.documentTypes) ? `${loan.GeneratedDocuments[0].documentTypes.length} documentos` : 'Sin documentos'}
                                </span>
                            </div>

                            <button
                                className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm rounded-md border border-gray-300 transition-colors flex items-center justify-center gap-1"
                                onClick={() => window.location.href = `/dashboard/loan/${loan.id}`}
                            >
                                <span>Examinar</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )) : (
                    <div>
                        <p className="text-sm text-gray-500">Sin solicitudes hazta el momento</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListLoansClient;