import useProof, { DocumentWithLoan } from "@/hooks/dashboard/useProof"
import { ScalarClient } from "@/types/client"
import { PiArrowCircleRightBold } from "react-icons/pi"

interface CardProofProps {
    docWithLoan: DocumentWithLoan
    selectedDocuments: string[]
    toggleDocumentSelection: (documentId: string) => void
}

function CardProof({
    docWithLoan,
    selectedDocuments,
    toggleDocumentSelection,
}: CardProofProps) {

    const {
        getFullName,
        downloadDocumentById
    } = useProof();

    return (
        <div
            key={docWithLoan.document.id}
            className={`flex items-center justify-between p-4 rounded-lg border transition-all ${selectedDocuments.includes(docWithLoan.document.id)
                ? 'border-blue-200 bg-blue-50'
                : docWithLoan.downloadCount === 0
                    ? 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    : 'border-gray-100 bg-gray-50'
                }`}
        >
            <div className="flex items-center space-x-4">
                <input
                    type="checkbox"
                    checked={selectedDocuments.includes(docWithLoan.document.id)}
                    onChange={() => toggleDocumentSelection(docWithLoan.document.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className={`w-2 h-2 rounded-full ${docWithLoan.downloadCount === 0 ? 'bg-green-400' : 'bg-gray-300'
                    }`}></div>
                <div>
                    <p className="font-medium text-gray-900 text-sm">
                        {getFullName(docWithLoan.loanApplication.user)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Solicitud: {docWithLoan.loanApplication.id}
                    </p>
                    {docWithLoan.lastDownloaded && (
                        <p className="text-xs text-gray-400 mt-1">
                            Última descarga: {new Date(docWithLoan.lastDownloaded).toLocaleDateString()}
                        </p>
                    )}
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
    )
}

export default CardProof