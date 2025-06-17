"use client"

import { useState, useRef } from 'react';
import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import useClient from "@/hooks/dashboard/useClients";
import { use } from "react";
import { IoSend, IoAttach } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { MdAlternateEmail } from 'react-icons/md';
import { FaRegCircleUser } from 'react-icons/fa6';

interface ContactProps { params: Promise<{ client_id: string }> }
interface AttachmentFile {
    name: string;
    size: number;
    id: string;
    file: File; // Agregamos el objeto File original
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

interface SendCustomEmailResponse {
    to: string;
    subject: string;
    attachmentCount: number;
}

function ContactClientPage({ params }: ContactProps) {
    const resolveParams = use(params);
    const clientId = resolveParams.client_id;
    const { clientData } = useClient({ params });

    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [recipientName, setRecipientName] = useState("");
    const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles: AttachmentFile[] = Array.from(e.target.files).map(file => ({
                name: file.name,
                size: file.size,
                id: Math.random().toString(36).substr(2, 9),
                file: file
            }));
            setAttachments([...attachments, ...newFiles]);
        }
    };

    const removeAttachment = (id: string) => {
        setAttachments(attachments.filter(file => file.id !== id));
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!clientData?.email) {
            alert("No se encontró el email del cliente");
            return;
        }

        setIsLoading(true);

        try {
            // Crear FormData
            const formData = new FormData();
            const fullname = `${clientData.names} ${clientData.firstLastName} ${clientData.secondLastName}`;

            // Agregar campos requeridos
            formData.append('email', clientData.email);
            formData.append('subject', subject);
            formData.append('message', message);
            formData.append('recipientName', fullname);
            formData.append('priority', "normal");

            // Agregar archivos
            attachments.forEach(attachment => {
                formData.append('files', attachment.file);
            });

            // Realizar la petición
            const response = await fetch('/api/dash/clients/contact', {
                method: 'POST',
                body: formData,
            });

            const result: ApiResponse<SendCustomEmailResponse> = await response.json();

            if (result.success) {
                // Limpiar formulario
                setSubject("");
                setMessage("");
                setRecipientName("");
                setAttachments([]);

                // Limpiar input de archivos
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }

                alert(`¡Email enviado exitosamente!\nPara: ${result.data?.to}\nAsunto: ${result.data?.subject}\nArchivos adjuntos: ${result.data?.attachmentCount || 0}`);
            } else {
                alert(`Error: ${result.error || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Error de conexión. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    return (
        <SidebarLayout>
            <div className="pt-20 p-4 sm:p-6 md:p-8 min-h-screen overflow-scroll">
                <div className="w-full">
                    <div className="px-6 py-4">
                        <header className="mb-8">
                            <h1 className="text-xl sm:text-2xl font-medium text-gray-800">Nuevo mensaje</h1>
                            <p className="text-gray-500 text-sm mt-1">Investiga datos personales, historial de prestamos, edita su informacion y toma control sobre sus cuentas</p>
                        </header>
                        {clientData && (
                            <div className='mt-1 flex flex-wrap gap-3'>
                                <div className='grid place-content-center bg-gray-50 px-3 py-2 rounded-md border border-gray-100'>
                                    <div className='flex flex-row gap-0.5'>
                                        <div className='grid place-content-center'>
                                            <MdAlternateEmail className='drop-shadow-md text-gray-500' />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-500 pb-0.5">
                                            Correo Electronico:
                                            <span className='font-thin text-sm text-gray-500 pb-0.5'> {clientData.email}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className='grid place-content-center bg-gray-50 px-3 py-2 rounded-md border border-gray-100'>
                                    <div className='flex flex-row gap-1'>
                                        <div className='grid place-content-center'>
                                            <FaRegCircleUser className='drop-shadow-md text-gray-500' />
                                        </div>
                                        <p className="text-sm font-normal text-gray-500 pb-0.5">
                                            Nombre:
                                            <span className='font-thin text-xs text-gray-500 pb-0.5'> {`${clientData.names} ${clientData.firstLastName} ${clientData.secondLastName}`}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="space-y-6">

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
                                    disabled={isLoading || !subject.trim() || !message.trim()}
                                    className="text-xs bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-md font-medium flex items-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <IoSend size={20} className="mr-2" />
                                    {isLoading ? 'Enviando...' : 'Enviar mensaje'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}

export default ContactClientPage;