import { validateToken } from "@/lib/ValidateAuth";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const token = await validateToken();

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const loanId = searchParams.get('loanId');
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '10';

        // Build query string
        const queryParams = new URLSearchParams();
        if (userId) queryParams.append('userId', userId);
        if (loanId) queryParams.append('loanId', loanId);
        queryParams.append('page', page);
        queryParams.append('limit', limit);

        const queryString = queryParams.toString();

        const response = await axios.get(
            `${process.env.GATEWAY_API}/pdfs/never-downloaded?${queryString}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Cookie: `intranet-token=${token}`
                }
            }
        );

        return NextResponse.json({
            data: response.data.documents,
            pagination: {
                total: response.data.total,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage,
                limit: parseInt(limit, 10)
            }
        });
    } catch (error) {
        console.error("Error fetching never downloaded documents:", error);

        if (axios.isAxiosError(error)) {
            return NextResponse.json(
                { error: error.response?.data?.message || 'Error fetching documents' },
                { status: error.response?.status || 500 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}