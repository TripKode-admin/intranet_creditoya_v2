"use client";
import BackButton from "@/components/gadgets/backBtn";
import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import React, { useState } from "react";
import { HiOutlineCube, HiOutlineExclamationTriangle, HiOutlineCog } from "react-icons/hi2";

interface ProcessDetailsBase {
    [key: string]: string | number | boolean;
}

interface CriticalProcess {
    id: string;
    processType: string;
    hash: string;
    timestamp: string;
    consensus: string;
    chainId: string;
    blockHeight: number;
    validator: string;
    status: string;
    details: ProcessDetailsBase;
}

interface ProcessIconProps {
    processType: string;
}

interface FormatTimestampOptions {
    year: 'numeric';
    month: '2-digit';
    day: '2-digit';
    hour: '2-digit';
    minute: '2-digit';
    second: '2-digit';
}

function BlockchainRegistry() {
    const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

    // Datos simulados de procesos críticos inmutados en KodeChain
    // NOTA: Solo metadatos públicos, datos sensibles hasheados off-chain
    // Para probar el estado vacío, cambia esta array por: []
    // const criticalProcesses: CriticalProcess[] = [
    //     {
    //         id: "kc_auth_001",
    //         processType: "User Authentication",
    //         hash: "0x7f9b8c2e3a4d5f8e9c1b2a7d8e5f3c9a4b6d8e2f1a9c5b7d3e8f2a6c9b4d7e",
    //         timestamp: "2025-07-01T14:23:15.421Z",
    //         consensus: "pBFT",
    //         chainId: "critical_process",
    //         blockHeight: 2847592,
    //         validator: "kodechain-validator-03",
    //         status: "IMMUTABLE",
    //         details: {
    //             userIdHash: "hash_d4f7e2c9b8a1", // Hash del userID real
    //             action: "LOGIN_SUCCESS",
    //             locationHash: "hash_geo_7b3d9e", // Hash de geolocalización 
    //             sessionHash: "hash_st_2f8c4a", // Hash del session token
    //             mfaVerified: true,
    //             riskScore: "LOW"
    //         }
    //     },
    //     {
    //         id: "kc_perm_002",
    //         processType: "Permission Grant",
    //         hash: "0x3a4b5c6d7e8f9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z",
    //         timestamp: "2025-07-01T14:18:42.893Z",
    //         consensus: "pBFT",
    //         chainId: "critical_process",
    //         blockHeight: 2847589,
    //         validator: "kodechain-validator-01",
    //         status: "IMMUTABLE",
    //         details: {
    //             adminHash: "hash_adm_5e8b2c", // Hash del admin ID
    //             targetUserHash: "hash_usr_9f3a6d", // Hash del usuario objetivo
    //             permission: "ADMIN_PANEL_ACCESS",
    //             approvalLevel: "LEVEL_3",
    //             approvedBy: "system_supervisor",
    //             justificationHash: "hash_just_4c7e9a" // Hash de la justificación
    //         }
    //     },
    //     {
    //         id: "kc_audit_003",
    //         processType: "System Audit Log",
    //         hash: "0x8e9f0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d",
    //         timestamp: "2025-07-01T14:15:28.127Z",
    //         consensus: "pBFT",
    //         chainId: "critical_process",
    //         blockHeight: 2847586,
    //         validator: "kodechain-validator-02",
    //         status: "IMMUTABLE",
    //         details: {
    //             auditType: "SECURITY_SCAN",
    //             scanId: "sec_scan_4f5g6h7i",
    //             vulnerabilitiesFound: 0,
    //             complianceScore: 98.7,
    //             executedBy: "automated_scanner",
    //             evidenceHash: "hash_ev_8d2f5a" // Hash de evidencias detalladas
    //         }
    //     },
    //     {
    //         id: "kc_config_004",
    //         processType: "Configuration Change",
    //         hash: "0x1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1g2h",
    //         timestamp: "2025-07-01T14:12:56.745Z",
    //         consensus: "pBFT",
    //         chainId: "critical_process",
    //         blockHeight: 2847583,
    //         validator: "kodechain-validator-04",
    //         status: "IMMUTABLE",
    //         details: {
    //             configType: "SECURITY_POLICY",
    //             changeId: "cfg_2h3i4j5k",
    //             parameterChanged: "session_timeout",
    //             changeHash: "hash_chg_6b9e3f", // Hash de valores específicos
    //             changedByHash: "hash_admin_7d4a2c", // Hash del admin
    //             approvalRequired: true
    //         }
    //     },
    //     {
    //         id: "kc_backup_005",
    //         processType: "Data Backup Verification",
    //         hash: "0x5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k",
    //         timestamp: "2025-07-01T14:08:33.952Z",
    //         consensus: "pBFT",
    //         chainId: "critical_process",
    //         blockHeight: 2847580,
    //         validator: "kodechain-validator-05",
    //         status: "IMMUTABLE",
    //         details: {
    //             backupId: "bkp_8k9l0m1n",
    //             dataIntegrityCheck: "PASSED",
    //             backupSizeCategory: "LARGE", // Categoría en vez de tamaño exacto
    //             compressionEfficiency: "HIGH",
    //             verificationAlgorithm: "SHA-256",
    //             contentHash: "hash_content_3e8f7a" // Hash del contenido
    //         }
    //     },
    //     {
    //         id: "kc_alert_006",
    //         processType: "Security Alert",
    //         hash: "0x9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o",
    //         timestamp: "2025-07-01T14:05:17.368Z",
    //         consensus: "pBFT",
    //         chainId: "critical_process",
    //         blockHeight: 2847577,
    //         validator: "kodechain-validator-01",
    //         status: "IMMUTABLE",
    //         details: {
    //             alertType: "INTRUSION_ATTEMPT",
    //             severity: "HIGH",
    //             sourceIPHash: "hash_ip_9b5d2e", // Hash de la IP real
    //             attackVector: "SQL_INJECTION",
    //             blocked: true,
    //             responseTime: "< 0.1s", // Rango en vez de tiempo exacto
    //             geoRegion: "EXTERNAL" // Región general sin precisión
    //         }
    //     }
    // ];

    const criticalProcesses: CriticalProcess[] = [];

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'IMMUTABLE': return 'text-green-600 bg-green-100';
            case 'PENDING': return 'text-yellow-600 bg-yellow-100';
            case 'FAILED': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getProcessIcon = (processType: string): React.ReactElement => {
        return <HiOutlineCube className="w-6 h-6 text-blue-600" />;
    };

    const formatTimestamp = (timestamp: string): string => {
        return new Date(timestamp).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        } as FormatTimestampOptions);
    };

    // Componente para el estado vacío
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <HiOutlineCube className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
                No hay transacciones registradas
            </h3>
            <p className="text-gray-500 text-center max-w-md">
                No se han encontrado procesos críticos de tus aplicaciones en la blockchain
            </p>
        </div>
    );

    // Banner de mantenimiento
    const MaintenanceBanner = () => (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-3">
                <HiOutlineExclamationTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-medium text-orange-800 mb-1">
                        Red Blockchain en Mantenimiento
                    </h3>
                    <p className="text-sm text-orange-700 mb-2">
                        La red KodeChain se encuentra actualmente en desarrollo y mantenimiento.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                        <HiOutlineCog className="w-4 h-4 animate-spin" />
                        <span>Los registros comenzarán a aparecer cuando la red esté disponible</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <SidebarLayout>
            <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen overflow-scroll">
                <BackButton />
                <header className="mb-8">
                    <h1 className="text-xl sm:text-2xl font-medium text-gray-800">Procesos críticos</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Procesos críticos de las aplicaciones inmutados en la Blockchain KodeChain
                    </p>
                    <div className="flex gap-4 mt-3 text-xs">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Red: KodeChain
                        </span>
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            Consenso: pBFT
                        </span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                            Cadena: critical_process
                        </span>
                    </div>
                </header>

                {/* Mostrar banner de mantenimiento si no hay procesos */}
                {criticalProcesses.length === 0 && <MaintenanceBanner />}

                {/* Mostrar lista de procesos o estado vacío */}
                {criticalProcesses.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {criticalProcesses.map((process) => (
                            <div
                                key={process.id}
                                className="border bg-white border-gray-200 hover:border-gray-300 p-4 rounded-lg hover:shadow-md cursor-pointer transition-all duration-200"
                                onClick={() => setSelectedProcess(selectedProcess === process.id ? null : process.id)}
                            >
                                <div className="flex flex-row gap-4 items-start">
                                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg flex-shrink-0">
                                        {getProcessIcon(process.processType)}
                                    </div>

                                    <div className="flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h2 className="text-lg font-medium text-gray-800">{process.processType}</h2>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(process.status)}`}>
                                                {process.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                            <div>
                                                <span className="font-medium">ID:</span> {process.id}
                                            </div>
                                            <div>
                                                <span className="font-medium">Bloque:</span> #{process.blockHeight}
                                            </div>
                                            <div>
                                                <span className="font-medium">Timestamp:</span> {formatTimestamp(process.timestamp)}
                                            </div>
                                            <div>
                                                <span className="font-medium">Validador:</span> {process.validator}
                                            </div>
                                        </div>

                                        <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                                            <span className="font-medium">Hash:</span> {process.hash}
                                        </div>

                                        {selectedProcess === process.id && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                                                <h3 className="font-medium text-gray-800 mb-3">Detalles del Proceso</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                    {Object.entries(process.details).map(([key, value]) => (
                                                        <div key={key} className="flex flex-col">
                                                            <span className="font-medium text-gray-600 capitalize">
                                                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                                                            </span>
                                                            <span className="text-gray-800 font-mono text-xs bg-white p-1 rounded">
                                                                {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : value}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState />
                )}

                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-800 mb-2">Información de la Red</h3>
                    <div className="text-sm text-blue-700 space-y-1">
                        <p><span className="font-medium">Red:</span> KodeChain Network</p>
                        <p><span className="font-medium">Algoritmo de Consenso:</span> Practical Byzantine Fault Tolerance (pBFT)</p>
                        <p><span className="font-medium">Cadena Específica:</span> critical_process</p>
                        <p><span className="font-medium">Validadores Activos:</span> 5 nodos validadores</p>
                        <p><span className="font-medium">Inmutabilidad:</span> Garantizada por consenso pBFT</p>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h3 className="font-medium text-yellow-800 mb-2">Privacidad y Seguridad</h3>
                    <div className="text-sm text-yellow-700 space-y-1">
                        <p><span className="font-medium">Datos Sensibles:</span> Hasheados off-chain con SHA-256</p>
                        <p><span className="font-medium">Información Pública:</span> Solo metadatos y hashes criptográficos</p>
                        <p><span className="font-medium">Acceso a Datos Completos:</span> Requiere autorización y clave privada</p>
                        <p><span className="font-medium">Cumplimiento:</span> GDPR/LGPD compatible</p>
                        <p><span className="font-medium">Auditabilidad:</span> Verificable sin exponer datos personales</p>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}

export default BlockchainRegistry;