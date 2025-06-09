import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { validateToken } from '@/lib/ValidateAuth';

interface ApiResponse {
    success: boolean;
    data?: any;
    error?: any;
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ loanId: string }> }
) {
    const token = await validateToken();

    try {
        const { loanId } = await context.params;

        console.log('🔍 Disbursing loan with loanId:', loanId);

        if (!loanId) {
            return NextResponse.json({
                success: false,
                error: 'loanId es requerido'
            }, { status: 400 });
        }

        // Hacer la petición al backend de NestJS para desembolsar el préstamo
        const response = await axios.put(
            `${process.env.GATEWAY_API}/loans/${loanId}/disburse`,
            {}, // Body vacío ya que el loanId va en la URL
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Cookie: `intranet-token=${token}`
                }
            }
        );

        if (response.data.success === false) throw new Error(response.data.error);

        console.log('✅ Loan disbursed successfully');

        // Construir la respuesta exitosa
        const apiResponse: ApiResponse = {
            success: true,
            data: response.data,
        };

        return NextResponse.json(apiResponse);
    } catch (error) {
        console.error('❌ Error al desembolsar el préstamo:', error);

        // Manejar errores específicos
        let errorMessage = 'Error desconocido';
        let statusCode = 500;

        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                errorMessage = 'Préstamo no encontrado';
                statusCode = 404;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
                statusCode = error.response.status || 500;
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        // Construir la respuesta de error
        const apiResponse: ApiResponse = {
            success: false,
            error: errorMessage,
        };

        return NextResponse.json(apiResponse, { status: statusCode });
    }
}

