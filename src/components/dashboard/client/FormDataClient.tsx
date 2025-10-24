import { IoIosCheckmarkCircle, IoMdFingerPrint } from "react-icons/io";
import {
    IoDocumentAttachOutline,
    IoBanOutline,
    IoPersonOutline
} from "react-icons/io5";
import { companiesUser } from "@/types/client";
import Image from "next/image";
import useClient from "@/hooks/dashboard/useClients";

function FormDataClient({ params }: { params: Promise<{ client_id: string }> }) {
    const {
        isValidAvatarUrl,
        editableData,
        handleChange,
        saveError,
        isSaving,
        handleUpdateClient,
        saveSuccess,
        handleRemoveAccount,
        isRemoving,
    } = useClient({ params });

    return (
        <div className="flex flex-col md:flex-row gap-4">
            {/* Avatar column */}
            <div className="flex justify-center md:justify-start md:flex-shrink-0">
                {isValidAvatarUrl(editableData?.avatar) ? (
                    <Image
                        src={editableData?.avatar as string}
                        alt="avatar"
                        width={200}
                        height={200}
                        className="shadow-md rounded-lg w-[150px] h-[150px] md:w-[200px] md:h-[200px] object-cover"
                    />
                ) : (
                    <div className="shadow-md rounded-lg w-[150px] h-[150px] md:w-[200px] md:h-[200px] bg-gray-100 flex items-center justify-center">
                        <IoPersonOutline size={80} className="text-gray-400" />
                    </div>
                )}
            </div>

            {/* Form and verifications */}
            <div className="flex flex-col md:flex-row flex-1 gap-4 min-w-0">
                {/* Form */}
                <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex flex-col space-y-1">
                        <p className="text-xs text-gray-700">Nombre</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={editableData?.names || ''}
                                onChange={(e) => handleChange('names', e.target.value)}
                                className="p-2 rounded-md text-sm outline-gray-200 border border-gray-400 font-thin text-gray-500 flex-1 min-w-0"
                                placeholder="Nombres"
                            />
                            <input
                                type="text"
                                value={editableData?.firstLastName || ''}
                                onChange={(e) => handleChange('firstLastName', e.target.value)}
                                className="p-2 rounded-md text-sm outline-gray-200 border border-gray-400 font-thin text-gray-500 flex-1 min-w-0"
                                placeholder="Primer apellido"
                            />
                            <input
                                type="text"
                                value={editableData?.secondLastName || ''}
                                onChange={(e) => handleChange('secondLastName', e.target.value)}
                                className="p-2 rounded-md text-sm outline-gray-200 border border-gray-400 font-thin text-gray-500 flex-1 min-w-0"
                                placeholder="Segundo apellido"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <p className="text-xs text-gray-700">Correo electrónico</p>
                        <input
                            type="email"
                            value={editableData?.email || ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="p-2 rounded-md text-sm outline-gray-200 border border-gray-400 font-thin text-gray-500 w-full min-w-0"
                        />
                    </div>

                    <div className="flex flex-col space-y-1">
                        <p className="text-xs text-gray-700">Ciudad</p>
                        <input
                            type="text"
                            value={editableData?.city || ''}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className="p-2 rounded-md text-sm outline-gray-200 border border-gray-400 font-thin text-gray-500 w-full min-w-0"
                        />
                    </div>

                    <div className="flex flex-col space-y-1">
                        <p className="text-xs text-gray-700">Empresa</p>
                        <select
                            value={editableData?.currentCompanie as companiesUser || 'no'}
                            onChange={(e) => handleChange('currentCompanie', e.target.value)}
                            className="p-2 rounded-md text-sm outline-gray-200 border border-gray-400 font-thin text-gray-500 w-full min-w-0"
                        >
                            <option value="incauca_sas">Incauca SAS</option>
                            <option value="incauca_cosecha">Incauca Cosecha</option>
                            <option value="providencia_sas">Providencia SAS</option>
                            <option value="providencia_cosecha">Providencia Cosecha</option>
                            <option value="con_alta">Con Alta</option>
                            <option value="pichichi_sas">Pichichi SAS</option>
                            <option value="pichichi_coorte">Pichichi Coorte</option>
                            <option value="valor_agregado">Valor Agregado</option>
                            <option value="no">Ninguna</option>
                        </select>
                    </div>

                    {saveError && (
                        <div className="text-red-500 text-sm">{saveError}</div>
                    )}

                    {saveSuccess && (
                        <div className="text-green-500 text-sm">Información actualizada correctamente.</div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-1">
                        <button
                            className={`${isSaving ? 'bg-gray-200' : 'bg-gray-50 hover:bg-gray-100'} cursor-pointer px-4 py-2 rounded-md text-sm text-gray-400 min-w-0`}
                            onClick={!isSaving ? handleUpdateClient : undefined}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Actualizando...' : 'Actualizar'}
                        </button>

                        <button
                            className={`${isRemoving ? 'bg-gray-400' : 'bg-red-300 hover:bg-red-400'} px-4 py-2 rounded-md flex items-center justify-center gap-1 min-w-0`}
                            onClick={!isRemoving ? handleRemoveAccount : undefined}
                            disabled={isRemoving}
                        >
                            <IoBanOutline className="text-white" />
                            <span className="text-sm text-white">
                                {isRemoving ? 'Deshabilitando...' : 'Deshabilitar cuenta'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Verifications - Fixed width and proper constraints */}
                <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-xs">Verificaciones</h1>

                        <div className="flex flex-row gap-2 bg-gray-50 px-2 py-2 rounded-md border border-transparent hover:border-gray-100">
                            <div className="flex items-center flex-shrink-0">
                                <IoMdFingerPrint size={20} className="drop-shadow-md" />
                            </div>
                            <div className="flex flex-col flex-grow min-w-0">
                                <h1 className="text-xs truncate">Verificación de identidad</h1>
                                <p className="font-thin text-xs text-gray-500 truncate">Reconocimiento facial</p>
                            </div>
                            <div className="flex items-center flex-shrink-0">
                                <IoIosCheckmarkCircle className="text-green-400 drop-shadow-md" />
                            </div>
                        </div>

                        <div className="flex flex-row gap-2 bg-gray-50 px-2 py-2 rounded-md border border-transparent hover:border-gray-100">
                            <div className="flex items-center flex-shrink-0">
                                <IoDocumentAttachOutline size={20} className="drop-shadow-md" />
                            </div>
                            <div className="flex flex-col flex-grow min-w-0">
                                <h1 className="text-xs truncate">Verificación de identidad</h1>
                                <p className="font-thin text-xs text-gray-500 truncate">Documento de identidad</p>
                            </div>
                            <div className="flex items-center flex-shrink-0">
                                <IoIosCheckmarkCircle className="text-green-400 drop-shadow-md" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormDataClient;