import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { validateToken } from "@/lib/ValidateAuth";

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

export async function POST(request: NextRequest) {
    const token = await validateToken();

    try {
        // Parse the FormData from the request
        const formData = await request.formData();
        
        // Extract text fields
        const email = formData.get('email') as string;
        const subject = formData.get('subject') as string;
        const message = formData.get('message') as string;
        const recipientName = formData.get('recipientName') as string | null;
        const priority = formData.get('priority') as 'high' | 'normal' | 'low' | null;

        // Validate required fields
        if (!email || !subject || !message) {
            return NextResponse.json<ApiResponse<null>>(
                { 
                    success: false, 
                    error: "Los campos email, subject y message son requeridos" 
                },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json<ApiResponse<null>>(
                { 
                    success: false, 
                    error: "Formato de email inválido" 
                },
                { status: 400 }
            );
        }

        // Extract files from FormData
        const files = formData.getAll('files') as File[];
        
        // Validate files if present
        if (files.length > 10) {
            return NextResponse.json<ApiResponse<null>>(
                { 
                    success: false, 
                    error: "Máximo 10 archivos permitidos" 
                },
                { status: 400 }
            );
        }

        // Validate file sizes (max 5MB per file)
        const maxFileSize = 5 * 1024 * 1024; // 5MB
        for (const file of files) {
            if (file.size > maxFileSize) {
                return NextResponse.json<ApiResponse<null>>(
                    { 
                        success: false, 
                        error: `El archivo ${file.name} excede el tamaño máximo de 5MB` 
                    },
                    { status: 400 }
                );
            }
        }

        // Build API URL
        const baseUrl = process.env.GATEWAY_API;
        if (!baseUrl) {
            throw new Error("GATEWAY_API environment variable is not defined");
        }

        const apiUrl = `${baseUrl}/mail/send-custom`;

        // Create FormData for the backend request
        const backendFormData = new FormData();
        
        // Add text fields
        backendFormData.append('email', email);
        backendFormData.append('subject', subject);
        backendFormData.append('message', message);
        
        if (recipientName) {
            backendFormData.append('recipientName', recipientName);
        }
        
        if (priority) {
            backendFormData.append('priority', priority);
        }

        // Add files to FormData
        for (const file of files) {
            if (file.size > 0) { // Only add non-empty files
                backendFormData.append('files', file, file.name);
            }
        }

        // Make request to NestJS backend
        const response = await axios.post<ApiResponse<SendCustomEmailResponse>>(
            apiUrl,
            backendFormData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Cookie: `intranet-token=${token}`,
                    // Don't set Content-Type header - let axios set it with boundary for multipart/form-data
                },
                timeout: 30000, // 30 seconds timeout for file uploads
                maxContentLength: 50 * 1024 * 1024, // 50MB max content length
                maxBodyLength: 50 * 1024 * 1024, // 50MB max body length
            }
        );

        // Return successful response
        return NextResponse.json<ApiResponse<SendCustomEmailResponse>>({
            success: true,
            message: 'Email enviado exitosamente',
            data: response.data.data,
        });

    } catch (error) {
        console.error("Error sending custom email:", error);

        // Handle specific error types
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const message = error.response?.data?.message || error.message;

            // Handle specific HTTP status codes
            if (status === 403) {
                return NextResponse.json<ApiResponse<null>>(
                    { 
                        success: false, 
                        error: "No tienes permisos para enviar emails" 
                    },
                    { status: 403 }
                );
            }

            if (status === 400) {
                return NextResponse.json<ApiResponse<null>>(
                    { 
                        success: false, 
                        error: `Datos inválidos: ${message}` 
                    },
                    { status: 400 }
                );
            }

            if (status === 413) {
                return NextResponse.json<ApiResponse<null>>(
                    { 
                        success: false, 
                        error: "Los archivos son demasiado grandes" 
                    },
                    { status: 413 }
                );
            }

            return NextResponse.json<ApiResponse<null>>(
                { 
                    success: false, 
                    error: `Error de API: ${message}` 
                },
                { status }
            );
        }

        // Handle timeout errors
        if (error instanceof Error && error.message.includes('timeout')) {
            return NextResponse.json<ApiResponse<null>>(
                { 
                    success: false, 
                    error: "La solicitud ha tardado demasiado tiempo. Por favor, inténtalo de nuevo." 
                },
                { status: 408 }
            );
        }

        // Handle file size errors
        if (error instanceof Error && error.message.includes('maxContentLength')) {
            return NextResponse.json<ApiResponse<null>>(
                { 
                    success: false, 
                    error: "Los archivos adjuntos son demasiado grandes" 
                },
                { status: 413 }
            );
        }

        return NextResponse.json<ApiResponse<null>>(
            { 
                success: false, 
                error: error instanceof Error ? error.message : "Error desconocido al enviar el email" 
            },
            { status: 500 }
        );
    }
}