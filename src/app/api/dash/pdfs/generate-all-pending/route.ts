import { validateToken } from "@/lib/ValidateAuth";
import axios from "axios";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST() {
  const token = await validateToken();
  try {
    const response = await axios.post(
      `${process.env.GATEWAY_API}/pdfs/generate-pending`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `intranet-token=${token}`,
        }
      }
    );
    const data = await response.data;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generando documentos pendientes:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.message || 'Error en proceso batch' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}