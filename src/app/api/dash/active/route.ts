import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { validateToken } from '@/lib/ValidateAuth';

// Define una interfaz para la respuesta
interface ApiResponse {
  success: boolean;
  data?: any;
  error?: any;
}

export async function GET(request: NextRequest) {
  const token = await validateToken();

  // Extraer los parámetros de consulta de la URL
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 5;

  try {
    // Realizar la petición a la API de préstamos pendientes
    // Pasamos las cookies automáticamente para la autenticación
    const response = await axios.get(
      `${process.env.GATEWAY_API}/loans/pending?page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          // Authorization: `Bearer ${token}`,
          Cookie: `intranet-token=${token}`
        },
      }
    );

    // Construir la respuesta exitosa
    const apiResponse: ApiResponse = {
      success: true,
      data: response.data
    };

    return NextResponse.json(apiResponse);
  } catch (error: any) {
    // Si hay un error 401, significa que el usuario no está autenticado
    if (error.response?.status === 401) {
      return NextResponse.json({
        success: false,
        error: 'No autenticado'
      }, { status: 401 });
    }

    // Manejar otros errores
    const apiResponse: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };

    return NextResponse.json(apiResponse, { status: 500 });
  }
}