import { validateToken } from "@/lib/ValidateAuth";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// Define una interfaz para la respuesta
interface ApiResponse {
    success: boolean;
    data?: any;
    error?: any;
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
}

export async function GET(request: NextRequest) {
    const token = await validateToken();

    // Extraer los parámetros de consulta de la URL
    const { searchParams } = new URL(request.url);

    try {
        const page = searchParams.get('page') || '1';
        const pageSize = searchParams.get('pageSize') || '6'; // Cambiado de '10' a '6'
        const search = searchParams.get('search') || '';

        console.log('API Route - Params received:', { page, pageSize, search });

        // Construir URL con parámetros para el backend
        const params = new URLSearchParams({
            page,
            pageSize,
            ...(search && { search })
        });

        console.log('Fetching pending disbursement loans with params:', params.toString());

        // Hacer la petición al backend de NestJS
        const response = await axios.get(
            `${process.env.GATEWAY_API}/loans/disbursed?${params.toString()}`, // Agregar params a la URL
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Cookie: `intranet-token=${token}`
                }
            }
        );

        console.log('Backend response:', response.data);

        if (response.data.success === false) throw new Error(response.data.error);

        // Construir la respuesta exitosa
        const apiResponse: ApiResponse = {
            success: true,
            data: response.data.data || [],
            total: response.data.total || 0,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            totalPages: Math.ceil((response.data.total || 0) / parseInt(pageSize)), // Calcular totalPages aquí si no viene del backend
        };

        console.log('API Response to frontend:', apiResponse);

        return NextResponse.json(apiResponse);
    } catch (error) {
        console.error('Error al obtener préstamos pendientes de desembolso:', error);

        // Manejar el error y construir la respuesta de error
        const page = parseInt(searchParams?.get('page') || '1');
        const pageSize = parseInt(searchParams?.get('pageSize') || '6'); // Cambiado de '10' a '6'

        const apiResponse: ApiResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
            data: [],
            total: 0,
            page,
            pageSize,
            totalPages: 0,
        };

        return NextResponse.json(apiResponse, { status: 500 });
    }
}