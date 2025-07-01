"use client";

import BackButton from "@/components/gadgets/backBtn";
import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import { Info, Settings } from "lucide-react";

interface Developer {
    name: string;
    avatar: string;
    color: string;
}

interface Project {
    id: number;
    title: string;
    description: string;
    status: "En desarrollo" | "Planificado" | "Investigación" | string;
    progress: number;
    timeline: string;
    developers: Developer[];
}

function RoadMap() {
    // Datos de ejemplo para los proyectos - Cambiar a [] para probar el estado vacío
    // const projects: Project[] = [
    //     {
    //         id: 1,
    //         title: "Mejoras de velocidad",
    //         description: "La aplicación cargará 3x más rápido",
    //         status: "En desarrollo",
    //         progress: 75,
    //         timeline: "Q1 2025",
    //         developers: [
    //             { name: "Ana García", avatar: "AG", color: "bg-blue-500" },
    //             { name: "Carlos López", avatar: "CL", color: "bg-green-500" }
    //         ]
    //     },
    //     {
    //         id: 2,
    //         title: "Nueva interfaz móvil",
    //         description: "Diseño más intuitivo para celulares",
    //         status: "Planificado",
    //         progress: 25,
    //         timeline: "Q2 2025",
    //         developers: [
    //             { name: "María Torres", avatar: "MT", color: "bg-purple-500" }
    //         ]
    //     },
    //     {
    //         id: 3,
    //         title: "Reportes automáticos",
    //         description: "Reciba resúmenes por correo cada semana",
    //         status: "En desarrollo",
    //         progress: 50,
    //         timeline: "Q1 2025",
    //         developers: [
    //             { name: "Juan Pérez", avatar: "JP", color: "bg-orange-500" },
    //             { name: "Sofia Ruiz", avatar: "SR", color: "bg-pink-500" },
    //             { name: "Luis Mendez", avatar: "LM", color: "bg-indigo-500" }
    //         ]
    //     },
    //     {
    //         id: 4,
    //         title: "Integración con WhatsApp",
    //         description: "Reciba notificaciones importantes por WhatsApp",
    //         status: "Investigación",
    //         progress: 10,
    //         timeline: "Q3 2025",
    //         developers: [
    //             { name: "Elena Castro", avatar: "EC", color: "bg-teal-500" }
    //         ]
    //     }
    // ];

    const projects: Project[] = [];

    const getStatusColor = (status: Project["status"]): string => {
        switch (status) {
            case "En desarrollo":
                return "text-green-700 bg-green-50 border-green-200";
            case "Planificado":
                return "text-blue-700 bg-blue-50 border-blue-200";
            case "Investigación":
                return "text-gray-700 bg-gray-50 border-gray-200";
            default:
                return "text-gray-700 bg-gray-50 border-gray-200";
        }
    };

    return (
        <SidebarLayout>
            <div className="pt-20 p-4 sm:p-6 md:p-8 bg-white min-h-screen overflow-scroll">
                <BackButton />

                <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">Próximas mejoras</h1>
                        <p className="text-gray-600 text-sm">Las nuevas funciones que estamos preparando para usted.</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-100 shrink-0">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-600 whitespace-nowrap">
                            Sincronizado desde BlockScrum
                        </span>
                    </div>
                </header>

                {/* Banner de mantenimiento - Se muestra cuando no hay proyectos */}
                {projects.length === 0 && (
                    <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                <Info className="h-5 w-5 text-orange-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-orange-800 mb-1">
                                    Sistema de planificación en mantenimiento
                                </h3>
                                <p className="text-sm text-orange-700">
                                    El servicio que proporciona la información sobre próximas actualizaciones, mejoras y optimizaciones 
                                    de <strong> Creditoya</strong> se encuentra bajo mantenimiento y desarrollo. El sistema estará 
                                    disponible nuevamente en breve para mostrar el roadmap actualizado.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <Settings className="h-4 w-4 text-orange-500 animate-spin" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Contenido cuando hay proyectos */}
                {projects.length > 0 ? (
                    <div className="space-y-3">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-white border border-gray-100 rounded-md p-4 hover:border-gray-200 transition-colors">
                                {/* Header compacto */}
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold text-gray-900 truncate">{project.title}</h3>
                                        <p className="text-gray-600 text-sm mt-1 line-clamp-1">{project.description}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium border whitespace-nowrap ${getStatusColor(project.status)}`}>
                                            {project.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Barra de progreso compacta */}
                                <div className="mb-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-medium text-gray-700">{project.progress}% completado</span>
                                        <span className="text-xs text-gray-500">{project.timeline}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div
                                            className="bg-gray-600 h-1.5 rounded-full transition-all duration-300"
                                            style={{ width: `${project.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Footer con desarrolladores */}
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">
                                        {project.developers.length === 1 ? 'Desarrollador' : 'Equipo'}
                                    </span>
                                    <div className="flex -space-x-1">
                                        {project.developers.map((dev, index) => (
                                            <div
                                                key={index}
                                                className={`w-5 h-5 ${dev.color} text-white text-xs font-bold rounded-full flex items-center justify-center border border-white shadow-sm`}
                                                title={dev.name}
                                            >
                                                {dev.avatar}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Estado vacío cuando no hay proyectos */
                    <div className="bg-white border border-gray-100 rounded-lg p-8 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Settings className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No hay próximas actualizaciones disponibles
                            </h3>
                            <p className="text-gray-500 text-sm max-w-md">
                                Actualmente no hay mejoras, optimizaciones o nuevas funciones programadas. 
                                Mantente atento para futuras actualizaciones del sistema.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}

export default RoadMap;