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

  // Extraer los parámetros de consulta de la URL
  const { searchParams } = new URL(request.url);
  const loanId = searchParams.get('loan_id');
  const userId = searchParams.get('user_id');

  try {
    // Realizar la petición a la API de préstamos pendientes
    const response = await axios.get(
      `${process.env.GATEWAY_API}/loans/${userId}/${loanId}/info`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `intranet-token=${token}`
        },
        withCredentials: true
      }
    );

    // Construir la respuesta exitosa
    const apiResponse: ApiResponse = {
      success: true,
      data: response.data
    };

    console.log(apiResponse.data)

    return NextResponse.json(apiResponse);
  } catch (error) {
    // Manejar el error y construir la respuesta de error
    const apiResponse: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };

    return NextResponse.json(apiResponse, { status: 500 });
  }
}