import { NextResponse } from 'next/server';
import axios from 'axios';
import { validateToken } from '@/lib/ValidateAuth';

export async function GET() {
  const token = await validateToken();
  try {
    const response = await axios.get(
      `${process.env.GATEWAY_API}/pdfs/pending-documents`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `intranet-token=${token}`
        }
      }
    );
    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error al obtener documentos pendientes:', error);
    return NextResponse.json({ success: false, error: 'Error al obtener los documentos' }, { status: 500 });
  }
}
