"use client"

import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import { IoSend, IoAttach, IoAdd, IoPersonAdd } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import useMassiveMails from '@/hooks/dashboard/useMassiveMails';
import BackButton from "@/components/gadgets/backBtn";

function MasiveMailsPage() {
    const {
        allUsers,
        sendAllClients,
        subject,
        message,
        attachments,
        fileInputRef,
        isLoading,
        individualRecipients,
        tempRecipient,
        showAllClients,
        excludedClientIds,
        handleSubmit,
        handleFileUpload,
        removeAttachment,
        triggerFileInput,
        formatFileSize,
        setMessage,
        setSubject,
        setTempRecipient,
        setShowAllClients,
        switchClients,
        addIndividualRecipient,
        removeIndividualRecipient,
        removeClientFromList,
    } = useMassiveMails();

    // Filtrar usuarios excluidos
    const filteredUsers = allUsers.filter(user => !excludedClientIds.includes(user.id));

    return (
        <SidebarLayout>
            <div className="pt-20 p-4  md:p-8 min-h-screen overflow-scroll">
                <div className="w-full">
                    <BackButton />

                    <div className="mt-5">
                        <header className="mb-8">
                            <h1 className="text-xl sm:text-2xl font-medium text-gray-800">Nuevo mensaje</h1>
                            <p className="text-gray-500 text-sm mt-1">Envía correos masivos a todos los clientes o a destinatarios específicos</p>
                        </header>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">

                            {/* Switch para envío masivo */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700">Incluir todos los clientes</h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {sendAllClients
                                                ? `Se incluirán ${filteredUsers.length} cliente${filteredUsers.length !== 1 ? 's' : ''} + destinatarios adicionales`
                                                : 'Solo enviar a destinatarios específicos'
                                            }
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={sendAllClients}
                                            onChange={switchClients}
                                            className="sr-only peer"
                                            disabled={isLoading}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                            </div>

                            {/* Sección de destinatarios individuales */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-4">
                                    {sendAllClients ? 'Destinatarios adicionales' : 'Destinatarios específicos'}
                                </h3>

                                {/* Inputs para agregar destinatario */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Nombre completo</label>
                                        <input
                                            type="text"
                                            value={tempRecipient.name}
                                            onChange={(e) => setTempRecipient({ ...tempRecipient, name: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                                            placeholder="Nombre del destinatario"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={tempRecipient.email}
                                            onChange={(e) => setTempRecipient({ ...tempRecipient, email: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                                            placeholder="correo@ejemplo.com"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            type="button"
                                            onClick={addIndividualRecipient}
                                            disabled={isLoading || !tempRecipient.name.trim() || !tempRecipient.email.trim()}
                                            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <IoPersonAdd size={16} className="mr-1" />
                                            Agregar
                                        </button>
                                    </div>
                                </div>

                                {/* Lista de destinatarios individuales */}
                                {individualRecipients.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-medium text-gray-600 mb-2">
                                            Destinatarios agregados ({individualRecipients.length})
                                        </h4>
                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                            {individualRecipients.map(recipient => (
                                                <div key={recipient.id} className="flex items-center justify-between bg-white px-3 py-2 rounded border border-gray-200">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-700 truncate">{recipient.name}</p>
                                                        <p className="text-xs text-gray-500 truncate">{recipient.email}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeIndividualRecipient(recipient.id)}
                                                        className="ml-2 text-gray-400 hover:text-red-500 transition"
                                                        disabled={isLoading}
                                                    >
                                                        <IoMdClose size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {individualRecipients.length === 0 && (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-gray-500">
                                            {sendAllClients ? 'No hay destinatarios adicionales' : 'No hay destinatarios agregados'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {sendAllClients
                                                ? 'Puedes agregar destinatarios adicionales aparte de todos los clientes'
                                                : 'Agrega al menos un destinatario para continuar'
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Lista de clientes mejorada (solo mostrar cuando está activo el envío masivo) */}
                            {sendAllClients && filteredUsers.length > 0 && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-medium text-gray-700">
                                            Clientes que recibirán el correo ({filteredUsers.length})
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowAllClients(!showAllClients)}
                                                className="text-xs text-green-600 hover:text-green-700 font-medium transition"
                                                disabled={isLoading}
                                            >
                                                {showAllClients ? 'Ver menos' : `Ver todos (${filteredUsers.length})`}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (window.confirm(`¿Estás seguro de que quieres desactivar el envío a todos los clientes?`)) {
                                                        switchClients();
                                                    }
                                                }}
                                                className="text-xs text-red-500 hover:text-red-600 font-medium transition"
                                                disabled={isLoading}
                                            >
                                                Desactivar
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`transition-all duration-300 ${showAllClients ? 'max-h-96' : 'max-h-20'} overflow-y-auto`}>
                                        <div className={`grid gap-2 ${showAllClients
                                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                                            }`}>
                                            {(showAllClients ? filteredUsers : filteredUsers.slice(0, 5)).map(user => (
                                                <div key={user.id} className="bg-white px-3 py-2 rounded border border-gray-200 group hover:border-red-300 transition-colors">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-700 truncate">{user.fullName}</p>
                                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeClientFromList(user.id)}
                                                            className="ml-2 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                                            disabled={isLoading}
                                                            title="Excluir de la lista"
                                                        >
                                                            <IoMdClose size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {!showAllClients && filteredUsers.length > 5 && (
                                            <div className="mt-2 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAllClients(true)}
                                                    className="text-xs text-green-600 hover:text-green-700 font-medium transition"
                                                    disabled={isLoading}
                                                >
                                                    Ver {filteredUsers.length - 5} clientes más...
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Mostrar clientes excluidos si los hay */}
                                    {excludedClientIds.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-green-200">
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-red-600 font-medium">
                                                    {excludedClientIds.length} cliente{excludedClientIds.length !== 1 ? 's' : ''} excluido{excludedClientIds.length !== 1 ? 's' : ''}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (window.confirm('¿Quieres restaurar todos los clientes excluidos?')) {
                                                            // Esta función debe agregarse al hook
                                                            // setExcludedClientIds([]);
                                                        }
                                                    }}
                                                    className="text-xs text-green-600 hover:text-green-700 font-medium transition"
                                                    disabled={isLoading}
                                                >
                                                    Restaurar todos
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Mensaje de advertencia si no hay destinatarios */}
                            {sendAllClients && filteredUsers.length === 0 && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-yellow-800">
                                                Todos los clientes han sido excluidos. Agrega destinatarios individuales o restaura algunos clientes.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Campo de asunto */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                    Asunto *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 transition text-base"
                                    placeholder="Escribe el asunto del correo"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Campo de mensaje */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mensaje *
                                </label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-md h-72 resize-none focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 transition text-base"
                                    placeholder="Escribe tu mensaje aquí..."
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Lista de archivos adjuntos */}
                            {attachments.length > 0 && (
                                <div className="border border-gray-100 rounded-md bg-gray-50 p-4">
                                    <h3 className="text-xs font-medium text-gray-700 mb-2">
                                        Archivos adjuntos ({attachments.length}/10)
                                    </h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {attachments.map(file => (
                                            <li key={file.id} className="flex items-center justify-between bg-white px-3 py-2 rounded border border-gray-200">
                                                <div className="truncate flex-1">
                                                    <span className="text-sm font-medium">{file.name}</span>
                                                    <span className="text-xs text-gray-500 ml-2">({formatFileSize(file.size)})</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttachment(file.id)}
                                                    className="text-gray-400 hover:text-gray-600 ml-2"
                                                    disabled={isLoading}
                                                >
                                                    <IoMdClose size={18} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Botones de acción */}
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <div>
                                    <input
                                        type="file"
                                        multiple
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileUpload}
                                        accept="*/*"
                                        disabled={isLoading || attachments.length >= 10}
                                    />
                                    <button
                                        type="button"
                                        onClick={triggerFileInput}
                                        disabled={isLoading || attachments.length >= 10}
                                        className="flex items-center text-sm font-medium text-gray-600 hover:text-green-600 transition px-4 py-2 border border-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <IoAttach size={20} className="mr-2" />
                                        Adjuntar archivos
                                    </button>
                                    {attachments.length >= 10 && (
                                        <p className="text-xs text-red-500 mt-1">Máximo 10 archivos permitidos</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={
                                        isLoading ||
                                        !subject.trim() ||
                                        !message.trim() ||
                                        ((sendAllClients && filteredUsers.length === 0) && individualRecipients.length === 0)
                                    }
                                    className="text-xs bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-md font-medium flex items-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <IoSend size={20} className="mr-2" />
                                    {isLoading ? 'Enviando...' :
                                        `Enviar mensaje (${(sendAllClients ? filteredUsers.length : 0) + individualRecipients.length} destinatarios)`
                                    }
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}

export default MasiveMailsPage;