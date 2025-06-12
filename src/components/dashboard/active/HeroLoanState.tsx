"use client"

import useActives from "@/hooks/dashboard/useActives"

function HeroLoanState() {
    const { activeTab } = useActives();
    return (
        <header className="mb-8">
            <h1 className="text-xl sm:text-2xl font-medium text-gray-800">
                {activeTab === 'aprobados'
                    ? 'Solicitudes Aprobadas'
                    : activeTab === 'aplazados'
                        ? 'Solicitudes Aplazadas'
                        : 'Solicitudes con Ajuste de Monto'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
                Gestiona las solicitudes según su estado
            </p>
        </header>
    )
}

export default HeroLoanState