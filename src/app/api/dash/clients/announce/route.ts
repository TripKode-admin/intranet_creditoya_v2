import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { validateToken } from "@/lib/ValidateAuth";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

interface SendAnnouncementEmailResponse {
    to: string;
    subject: string;
    title: string;
    hasBannerImage: boolean;
}

interface AdditionalMessage {
    title: string;
    content: string;
}

export async function POST(request: NextRequest) {
    const token = await validateToken();

    try {
        // Parse the FormData from the request
        const formData = await request.formData();

        // Extract text fields
        const email = formData.get('email') as string;
        const subject = formData.get('subject') as string;
        const title = formData.get('title') as string;
        const message = formData.get('message') as string;
        const recipientName = formData.get('recipientName') as string | null;
        const priority = formData.get('priority') as 'high' | null;
        const senderName = formData.get('senderName') as string | null;
        const additionalMessagesString = formData.get('additionalMessages') as string | null;

        // Validate required fields
        if (!email || !subject || !title || !message) {
            return NextResponse.json<ApiResponse<null>>(
                {
                    success: false,
                    error: "Los campos email, subject, title y message son requeridos"
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

        // Parse and validate additionalMessages if provided
        let additionalMessages: AdditionalMessage[] | undefined;
        if (additionalMessagesString) {
            try {
                additionalMessages = JSON.parse(additionalMessagesString);

                // Validate additionalMessages structure
                if (!Array.isArray(additionalMessages)) {
                    return NextResponse.json<ApiResponse<null>>(
                        {
                            success: false,
                            error: "additionalMessages debe ser un array"
                        },
                        { status: 400 }
                    );
                }

                // Validate each additional message has required fields
                for (const msg of additionalMessages) {
                    if (!msg.title || !msg.content) {
                        return NextResponse.json<ApiResponse<null>>(
                            {
                                success: false,
                                error: "Cada mensaje adicional debe tener título y contenido"
                            },
                            { status: 400 }
                        );
                    }
                }
            } catch (error) {
                return NextResponse.json<ApiResponse<null>>(
                    {
                        success: false,
                        error: "Formato JSON inválido en additionalMessages"
                    },
                    { status: 400 }
                );
            }
        }

        // Extract banner image from FormData
        const bannerImage = formData.get('bannerImage') as File | null;

        // Validate banner image if present
        if (bannerImage && bannerImage.size > 0) {
            const maxFileSize = 5 * 1024 * 1024; // 5MB
            if (bannerImage.size > maxFileSize) {
                return NextResponse.json<ApiResponse<null>>(
                    {
                        success: false,
                        error: `La imagen de banner excede el tamaño máximo de 5MB`
                    },
                    { status: 400 }
                );
            }

            // Validate image type
            const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedImageTypes.includes(bannerImage.type)) {
                return NextResponse.json<ApiResponse<null>>(
                    {
                        success: false,
                        error: "Tipo de imagen no válido. Solo se permiten JPEG, PNG, GIF y WebP"
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

        const apiUrl = `${baseUrl}/mail/send-announcement`;

        // Create FormData for the backend request
        const backendFormData = new FormData();

        // Add text fields
        backendFormData.append('email', email);
        backendFormData.append('subject', subject);
        backendFormData.append('title', title);
        backendFormData.append('message', message);

        if (recipientName) {
            backendFormData.append('recipientName', recipientName);
        }

        if (priority) {
            backendFormData.append('priority', priority);
        }

        if (senderName) {
            backendFormData.append('senderName', senderName);
        }

        // Add additionalMessages as JSON string if provided
        if (additionalMessages) {
            backendFormData.append('additionalMessages', JSON.stringify(additionalMessages));
        }

        // Add banner image if present
        if (bannerImage && bannerImage.size > 0) {
            backendFormData.append('bannerImage', bannerImage, bannerImage.name);
        }

        // Make request to NestJS backend
        const response = await axios.post<ApiResponse<SendAnnouncementEmailResponse>>(
            apiUrl,
            backendFormData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Cookie: `intranet-token=${token}`,
                    // Don't set Content-Type header - let axios set it with boundary for multipart/form-data
                },
                timeout: 30000, // 30 seconds timeout for file uploads
                maxContentLength: 10 * 1024 * 1024, // 10MB max content length
                maxBodyLength: 10 * 1024 * 1024, // 10MB max body length
            }
        );

        // Return successful response
        return NextResponse.json<ApiResponse<SendAnnouncementEmailResponse>>({
            success: true,
            message: 'Email de anuncio enviado exitosamente',
            data: response.data.data,
        });

    } catch (error) {
        console.error("Error sending announcement email:", error);

        // Handle specific error types
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const message = error.response?.data?.message || error.message;

            // Handle specific HTTP status codes
            if (status === 403) {
                return NextResponse.json<ApiResponse<null>>(
                    {
                        success: false,
                        error: "No tienes permisos para enviar emails de anuncios"
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
                        error: "La imagen de banner es demasiado grande"
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
                    error: "La imagen de banner es demasiado grande"
                },
                { status: 413 }
            );
        }

        return NextResponse.json<ApiResponse<null>>(
            {
                success: false,
                error: error instanceof Error ? error.message : "Error desconocido al enviar el email de anuncio"
            },
            { status: 500 }
        );
    }
}