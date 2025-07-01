"use client"

import BackButton from "@/components/gadgets/backBtn";
import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import {
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Database,
    HardDrive,
    Globe,
    Shield,
    Wifi,
    Info,
    Settings
} from "lucide-react";

function SystemAppsPage() {
    const router = useRouter();

    // Estado para los servicios y su status
    const [services, setServices] = useState([
        { name: "Creditoya core", status: "online", performance: "--%", lastCheck: "Hace 5 min" },
        { name: "Creditoya superapp", status: "online", performance: "--%", lastCheck: "Hace 3 min" },
        { name: "Creditoya intranet", status: "warning", performance: "--%", lastCheck: "Hace 2 min" },
        { name: "Base de datos", status: "online", performance: "--%", lastCheck: "Hace 1 min" },
        { name: "Último Backup", status: "completed", performance: "", lastCheck: "Hace 2 horas" }
    ]);

    // Simulación de actualización de estados cada 30 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            // Aquí podrías hacer un fetch real a tu API
            // Simulamos cambios aleatorios para la demo
            const updatedServices = services.map(service => {
                const statuses = ["online", "warning", "offline"];
                const randomStatus = Math.random() > 0.8
                    ? statuses[Math.floor(Math.random() * statuses.length)]
                    : service.status;

                return {
                    ...service,
                    status: randomStatus,
                    lastCheck: "Hace 1 min"
                };
            });

            setServices(updatedServices);
        }, 30000);

        return () => clearInterval(interval);
    }, [services]);

    // Función para determinar el icono y color según el estado
    const getStatusIcon = (status: any, serviceName: string) => {
        const iconProps = { size: 20 };

        switch (status) {
            case "online":
                return <CheckCircle2 {...iconProps} className="text-green-500" />;
            case "warning":
                return <AlertTriangle {...iconProps} className="text-yellow-500" />;
            case "offline":
                return <XCircle {...iconProps} className="text-red-500" />;
            case "completed":
                return <CheckCircle2 {...iconProps} className="text-blue-500" />;
            default:
                return <CheckCircle2 {...iconProps} className="text-gray-300" />;
        }
    };

    // Función para obtener el icono del servicio
    const getServiceIcon = (serviceName: string) => {
        const iconProps = { size: 18 };

        if (serviceName.includes("core")) return <Shield {...iconProps} className="text-gray-600" />;
        if (serviceName.includes("superapp")) return <Globe {...iconProps} className="text-gray-600" />;
        if (serviceName.includes("intranet")) return <Globe {...iconProps} className="text-gray-600" />;
        if (serviceName.includes("datos")) return <Database {...iconProps} className="text-gray-600" />;
        if (serviceName.includes("Backup")) return <HardDrive {...iconProps} className="text-gray-600" />;

        return <Globe {...iconProps} className="text-gray-600" />;
    };

    return (
        <SidebarLayout>
            <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen overflow-scroll">
                <BackButton />

                <header className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-medium text-gray-800">Estado del sistema</h1>
                            <p className="text-gray-500 text-sm mt-1">Mire en tiempo real el funcionamiento de los servicios y su rendimiento en el dia</p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                                <Wifi size={12} className="text-green-500" />
                                <span
                                    className="cursor-pointer"
                                    onClick={() => window.location.href = "https://blockscrum.vercel.app/"}
                                >BlockScrum</span>
                                <span className="text-green-600 font-medium">• Desconectado</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Banner Informativo */}
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                            <Info className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-blue-800 mb-1">
                                Servicio de analítica en mantenimiento
                            </h3>
                            <p className="text-sm text-blue-700">
                                El servicio que proporciona la analítica sobre el <strong>Estado del sistema</strong> y el 
                                rendimiento en tiempo real de los servicios se encuentra actualmente bajo mantenimiento y desarrollo. 
                                Pronto estará en línea nuevamente para brindarle información actualizada.
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <Settings className="h-4 w-4 text-blue-500 animate-spin" />
                        </div>
                    </div>
                </div>

                <div className="grid gap-4">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="mr-4">
                                    {getServiceIcon(service.name)}
                                </div>
                                <div>
                                    <h3 className="font-medium">{service.name}</h3>
                                    <p className="text-sm text-gray-500">{service.lastCheck}</p>
                                </div>
                            </div>

                            {service.performance && (
                                <div className="text-right">
                                    <span className="font-medium">{service.performance}</span>
                                    <p className="text-sm text-gray-500">rendimiento</p>
                                </div>
                            )}

                            {!service.performance && service.name === "Último Backup" && (
                                <div className="text-right">
                                    <div className="flex flex-row">
                                        <p
                                            className="text-sm text-gray-500 cursor-pointer hover:text-gray-700"
                                            onClick={() => router.push("/dashboard/soporte/sistema/backups")}
                                        >Administrar</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </SidebarLayout>
    )
}

export default SystemAppsPage;