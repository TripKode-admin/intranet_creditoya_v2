import { validateToken } from "@/lib/ValidateAuth";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// y /api/dash/backup (POST - crear backup)
export async function GET(req: NextRequest) {
    const token = await validateToken();

    const url = new URL(req.url);
    const path = url.pathname;

    // Para descargar un backup
    if (path.includes('/api/backups/download')) {
        try {
            const searchParams = url.searchParams;
            const backupPath = searchParams.get('path');

            if (!backupPath) {
                return NextResponse.json({
                    success: false,
                    message: 'Backup path is required',
                }, { status: 400 });
            }

            // Extract just the path part after database_backups/
            const pathParts = backupPath.split('database_backups/');
            const relativePath = pathParts.length > 1 ? pathParts[1] : backupPath;

            const response = await axios.get(
                `${process.env.GATEWAY_API}/admin/database/backup/download/${relativePath}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Cookie: `intranet-token=${token}`,
                    },
                }
            );

            return NextResponse.json(response.data);
        } catch (error) {
            console.error('Error generating download URL:', error);
            return NextResponse.json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to generate download URL',
            }, { status: 500 });
        }
    }

    // Para listar todos los backups (ruta adaptada para /api/dash/backup)
    else if (path.includes('/api/dash/backup')) {
        try {
            const response = await axios.get(
                `${process.env.GATEWAY_API}/admin/database/backups`,
                {
                    headers: {
                        Cookie: `intranet-token=${token}`,
                    },
                }
            );

            return NextResponse.json(response.data);
        } catch (error) {
            console.error('Error fetching backups:', error);
            return NextResponse.json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch backups',
            }, { status: 500 });
        }
    }

    // Fallback para rutas GET desconocidas
    else {
        return NextResponse.json({
            success: false,
            message: 'Unknown endpoint',
        }, { status: 404 });
    }
}

export async function POST(req: NextRequest) {
    const token = await validateToken();

    const url = new URL(req.url);
    const path = url.pathname;

    // Para crear un backup (ruta adaptada para /api/dash/backup)
    if (path.includes('/api/dash/backup') && !path.includes('/restore')) {
        try {
            const response = await axios.post(
                `${process.env.GATEWAY_API}/admin/database/backup`,
                {},  // Empty body object
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Cookie: `intranet-token=${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return NextResponse.json(response.data);
        } catch (error) {
            console.error('Error creating backup:', error);
            return NextResponse.json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to create backup',
            }, { status: 500 });
        }
    }
    // Para restaurar un backup (ruta adaptada para /api/dash/backup/restore)
    else if (path.includes('/api/dash/backup/restore')) {
        try {
            const body = await req.json();

            if (!body.backupPath) {
                return NextResponse.json({
                    success: false,
                    message: 'Backup path is required',
                }, { status: 400 });
            }

            const response = await axios.post(
                `${process.env.GATEWAY_API}/admin/database/restore`,
                { backupPath: body.backupPath },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return NextResponse.json(response.data);
        } catch (error) {
            console.error('Error restoring backup:', error);
            return NextResponse.json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to restore backup',
            }, { status: 500 });
        }
    }
    // Fallback para rutas POST desconocidas
    else {
        return NextResponse.json({
            success: false,
            message: 'Unknown endpoint',
        }, { status: 404 });
    }
}