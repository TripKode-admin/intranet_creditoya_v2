// /api/auth/intranet/logout/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { validateToken } from '@/lib/ValidateAuth';

export async function POST(request: Request) {
    const token = await validateToken();
    try {
        // Realizar la petición a la API para revocar el token
        await axios.post(
            `${process.env.GATEWAY_API}/auth/logout/intranet`,
            {},
            { headers: { Cookie: `intranet-token=${token}` } }
        );

        // Crear la respuesta
        const res = NextResponse.json({
            success: true
        });

        // Eliminar la cookie
        res.cookies.set({
            name: 'intranet-token',
            value: '',
            path: '/',
            expires: new Date(0), // Expirar inmediatamente
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        return res;
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}