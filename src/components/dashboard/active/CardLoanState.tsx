"use client"

import { handleKeyToCompany } from "@/handlers/keyToCompany";
import { LoanData } from "@/hooks/dashboard/useActives";
import { useRouter } from "next/navigation";
import { FiCalendar, FiFileText, FiUser } from "react-icons/fi";

interface CardLoanStateProps {
    item: LoanData,
    formatCurrency: (value: string) => string,
    formatDate: (dateString: string) => string
}

function CardLoanState({
    item,
    formatCurrency,
    formatDate,
}: CardLoanStateProps) {
    const router = useRouter();

    return (
        <div onClick={() => router.push(`/dashboard/loan/${item.loanApplication.id}?userId=${item.loanApplication.userId}`)} key={item.loanApplication.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="mb-3 md:mb-0">
                    <div className="flex items-center mb-2">
                        <FiUser className="mr-2 text-gray-500" />
                        <h3 className="font-semibold text-lg">{`${item.user.names} ${item.user.firstLastName} ${item.user.secondLastName}`}</h3>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <FiFileText className="mr-2" />
                        <span>{`${item.document.typeDocument}: ${item.document.number}`}</span>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center mb-1">
                        <span className="font-medium">{formatCurrency(item.loanApplication.cantity)}</span>
                    </div>
                    {item.loanApplication.newCantity && (
                        <div className="flex items-center text-sm text-blue-600">
                            <span className="font-medium">Nuevo: {formatCurrency(item.loanApplication.newCantity)}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-3 flex flex-wrap justify-between items-center">
                <div className="flex items-center text-sm text-gray-600 mb-2 md:mb-0">
                    <FiCalendar className="mr-1" />
                    <span>{formatDate(String(item.loanApplication.created_at))}</span>
                </div>

                <div className="flex items-center">
                    <span className="text-sm mr-2">{handleKeyToCompany(item.user.currentCompanie || "Sin Definir")}</span>
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${item.loanApplication.status === 'Aprobado'
                            ? 'bg-green-100 text-green-800'
                            : item.loanApplication.status === 'Aplazado'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                    >
                        {item.loanApplication.status}
                    </span>
                </div>
            </div>

            {(item.loanApplication.reasonChangeCantity || item.loanApplication.reasonReject) && (
                <div className="mt-2 text-sm italic text-gray-600 border-t pt-2">
                    <span>Motivo: {item.loanApplication.reasonChangeCantity || item.loanApplication.reasonReject}</span>
                </div>
            )}
        </div>
    )
}

export default CardLoanState