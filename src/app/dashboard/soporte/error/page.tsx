"use client";

import { useState } from "react";
import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import { IoBugOutline } from "react-icons/io5";
import BackButton from "@/components/gadgets/backBtn";
import { Info, Settings } from "lucide-react";

function ErrorsAppsPage() {
    const [activeTab, setActiveTab] = useState<"activos" | "historial">("activos");

    return (
        <SidebarLayout>
            <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen overflow-scroll">
                <BackButton />
                <header className="mb-6">
                    <h1 className="text-xl sm:text-2xl font-medium text-gray-800">Gestión de errores</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Informa cualquier fallo detectado en las aplicaciones para poder resolverlo rápidamente.
                    </p>
                </header>

                {/* Banner Informativo */}
                <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                            <Info className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-orange-800 mb-1">
                                Sistema de monitoreo de errores en mantenimiento
                            </h3>
                            <p className="text-sm text-orange-700">
                                El servicio que proporciona el monitoreo de errores en tiempo real provenientes de los servicios de 
                                <strong> Creditoya</strong> y la funcionalidad para reportar errores no detectados automáticamente 
                                se encuentra bajo mantenimiento y desarrollo. El sistema estará disponible nuevamente en breve.
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <Settings className="h-4 w-4 text-orange-500 animate-spin" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div
                        className="flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 transition-colors px-4 py-2 rounded-md cursor-pointer"
                        onClick={() => alert("BlockScrum en mantenimiento, pronto estaremos de regreso...")}
                    >
                        <IoBugOutline className="text-indigo-600" />
                        <span className="text-sm text-indigo-700 font-medium">Nuevo reporte</span>
                    </div>

                    <div className="flex flex-row gap-2 bg-white border rounded-md overflow-hidden">
                        <button
                            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "activos"
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                            onClick={() => setActiveTab("activos")}
                        >
                            Activos
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "historial"
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                            onClick={() => setActiveTab("historial")}
                        >
                            Historial
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    {activeTab === "activos" ? (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Reportes activos</h2>
                            <p className="text-sm text-gray-500">Aquí se muestran los reportes de errores que aún no han sido resueltos.</p>
                            {/* Puedes mapear aquí los reportes activos */}
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Historial de reportes</h2>
                            <p className="text-sm text-gray-500">Lista de errores ya solucionados o cerrados.</p>
                            {/* Puedes mapear aquí el historial de reportes */}
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}

export default ErrorsAppsPage;