import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { validateToken } from "@/lib/ValidateAuth";
import { ScalarClient } from "@/types/client";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function GET(request: NextRequest) {
    const token = await validateToken();

    try {
        // Parse URL parameters
        const { searchParams } = new URL(request.url);
        const clientId = searchParams.get("client_id");
        const page = Number(searchParams.get("page") || "1");
        const pageSize = Number(searchParams.get("pageSize") || "10");
        const search = searchParams.get("search");

        // Validate pagination parameters
        if (!Number.isInteger(page) || !Number.isInteger(pageSize) || page < 1 || pageSize < 1) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: "Parámetros de paginación inválidos" },
                { status: 400 }
            );
        }

        // Build API URL
        const baseUrl = process.env.GATEWAY_API;
        if (!baseUrl) {
            throw new Error("GATEWAY_API environment variable is not defined");
        }

        // Construir la URL con los parámetros
        let apiUrl = clientId
            ? `${baseUrl}/clients/${encodeURIComponent(clientId)}`
            : `${baseUrl}/clients?page=${page}&pageSize=${pageSize}`;

        // Añadir el parámetro de búsqueda si existe
        if (!clientId && search) {
            apiUrl += `&search=${encodeURIComponent(search.trim())}`;
        }

        // Fetch data
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                Cookie: `intranet-token=${token}`,
            },
            timeout: 5000 // 5 seconds timeout
        });

        // Return the response data directly from the backend
        return NextResponse.json<ApiResponse<typeof response.data>>({
            success: true,
            data: response.data,
        });

    } catch (error) {
        console.error("Error fetching clients:", error);

        // Handle specific error types
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const message = error.response?.data?.message || error.message;

            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: `Error de API: ${message}` },
                { status }
            );
        }

        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    const token = await validateToken();

    try {
        // Parse the request body
        const body = await request.json();
        const { client } = body;

        // Validate that client data exists
        if (!client || !client.id) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: "Datos del cliente requeridos" },
                { status: 400 }
            );
        }

        // Build API URL
        const baseUrl = process.env.GATEWAY_API;
        if (!baseUrl) {
            throw new Error("GATEWAY_API environment variable is not defined");
        }

        const apiUrl = `${baseUrl}/clients/${encodeURIComponent(client.id)}`;

        // Prepare the data to send (exclude password and other sensitive fields)
        const { id, password, createdAt, updatedAt, ...updateData } = client;

        // Make PUT request to backend
        const response = await axios.put(
            apiUrl,
            updateData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Cookie: `intranet-token=${token}`,
                    'Content-Type': 'application/json',
                },
                timeout: 10000 // 10 seconds timeout for updates
            }
        );

        // Return the response data from the backend
        return NextResponse.json<ApiResponse<typeof response.data>>({
            success: true,
            data: response.data,
        });

    } catch (error) {
        console.error("Error updating client:", error);

        // Handle specific error types
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const message = error.response?.data?.message || error.message;

            // Handle specific HTTP status codes
            if (status === 403) {
                return NextResponse.json<ApiResponse<null>>(
                    { success: false, error: "No tienes permisos para actualizar este cliente" },
                    { status: 403 }
                );
            }

            if (status === 400) {
                return NextResponse.json<ApiResponse<null>>(
                    { success: false, error: `Datos inválidos: ${message}` },
                    { status: 400 }
                );
            }

            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: `Error de API: ${message}` },
                { status }
            );
        }

        // Handle timeout errors
        if (error instanceof Error && error.message.includes('timeout')) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: "La solicitud ha tardado demasiado tiempo. Por favor, inténtalo de nuevo." },
                { status: 408 }
            );
        }

        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: error instanceof Error ? error.message : "Error desconocido al actualizar el cliente" },
            { status: 500 }
        );
    }
}