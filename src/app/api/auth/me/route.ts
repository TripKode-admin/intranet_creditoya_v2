// /api/auth/intranet/me/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { validateToken } from '@/lib/ValidateAuth';

// Define una interfaz para la respuesta
interface ApiResponse {
  success: boolean;
  data?: any;
  error?: any;
}

export async function GET(request: Request) {
  const token = await validateToken();

  try {
    // Realizar la petición a la API para verificar la autenticación
    const response = await axios.get(
      `${process.env.GATEWAY_API}/auth/me/intranet`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `intranet-token=${token}`
        }
      }
    );

    // Extraer los datos de la respuesta
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