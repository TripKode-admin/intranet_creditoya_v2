"use client"

import { ScalarLoanApplication } from "@/types/loan";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle, CreditCard, Info, Loader2, User } from "lucide-react";
import { BankTypes, handleKeyToStringBank } from "@/handlers/typeBank";

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
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
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
                        {loan.status}
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
                        {formatCurrency(
                            loan.reasonChangeCantity && loan.newCantity
                                ? loan.newCantity
                                : loan.cantity || '0'
                        )}
                    </p>
                </div>

                <div className="text-center sm:text-left">
                    <p className="text-sm text-gray-500 mb-1">Entidad bancaria</p>
                    <p className="font-medium text-gray-900 truncate" title={loan.entity}>
                        {handleKeyToStringBank(loan.entity as BankTypes)}
                    </p>
                </div>
                <div className="text-center sm:text-left">
                    <p className="text-sm text-gray-500 mb-1">Fecha de aprobación</p>
                    <p className="font-medium text-gray-900">
                        {formatDate(loan.created_at)}
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
                    onClick={() => router.push(`/dashboard/loan/${loan.id}?userId=${loan.userId}`)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                    <Info className="w-4 h-4" />
                    <span>Ver información</span>
                </button>
            </div>
        </div>
    );
};


export default LoanCard