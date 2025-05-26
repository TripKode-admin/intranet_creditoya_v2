import { validateToken } from "@/lib/ValidateAuth";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Validar token primero
        const token = await validateToken();

        if (!token) {
            console.error('No token provided or invalid token');
            return NextResponse.json({
                success: false,
                message: 'Authentication required',
            }, { status: 401 });
        }

        const url = new URL(req.url);
        const path = url.pathname;

        console.log('GET request received for path:', path);
        console.log('Environment variables check:', {
            hasGatewayApi: !!process.env.GATEWAY_API,
            gatewayApi: process.env.GATEWAY_API
        });

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

                console.log('Requesting download for path:', relativePath);

                const response = await axios.get(
                    `${process.env.GATEWAY_API}/admin/database/backup/download/${relativePath}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Cookie: `intranet-token=${token}`
                        },
                        timeout: 30000, // 30 seconds timeout
                    }
                );

                return NextResponse.json(response.data);
            } catch (error) {
                console.error('Error generating download URL:', error);

                if (axios.isAxiosError(error)) {
                    console.error('Axios error details:', {
                        status: error.response?.status,
                        statusText: error.response?.statusText,
                        data: error.response?.data,
                        url: error.config?.url
                    });
                }

                return NextResponse.json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Failed to generate download URL',
                }, { status: 500 });
            }
        }
        // Para obtener lista de backups
        else if (path.includes('/api/dash/backup')) {
            try {
                console.log('Fetching backups from:', `${process.env.GATEWAY_API}/admin/database/backups`);
                console.log('Using token:', token ? 'Present' : 'Missing');

                const response = await axios.get(
                    `${process.env.GATEWAY_API}/admin/database/backups`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Cookie: `intranet-token=${token}`
                        },
                        timeout: 30000, // 30 seconds timeout
                    }
                );

                console.log('Backups fetched successfully:', response.data);
                return NextResponse.json(response.data);

            } catch (error) {
                console.error('Error fetching backups:', error);

                if (axios.isAxiosError(error)) {
                    console.error('Axios error details:', {
                        status: error.response?.status,
                        statusText: error.response?.statusText,
                        data: error.response?.data,
                        url: error.config?.url,
                        message: error.message
                    });

                    // Return more specific error based on status
                    if (error.response?.status === 401) {
                        return NextResponse.json({
                            success: false,
                            message: 'Unauthorized - Invalid or expired token',
                        }, { status: 401 });
                    } else if (error.response?.status === 403) {
                        return NextResponse.json({
                            success: false,
                            message: 'Forbidden - Insufficient permissions',
                        }, { status: 403 });
                    } else if (error.response?.status === 404) {
                        return NextResponse.json({
                            success: false,
                            message: 'Backup endpoint not found',
                        }, { status: 404 });
                    }
                } else if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'ECONNREFUSED') {
                    return NextResponse.json({
                        success: false,
                        message: 'Cannot connect to backend server',
                    }, { status: 503 });
                }

                return NextResponse.json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Failed to fetch backups',
                }, { status: 500 });
            }
        }
        // Fallback para rutas GET desconocidas
        else {
            console.log('Unknown GET endpoint:', path);
            return NextResponse.json({
                success: false,
                message: 'Unknown endpoint',
            }, { status: 404 });
        }

    } catch (error) {
        console.error('Unexpected error in GET handler:', error);

        // Si el error es de validateToken, probablemente sea 401
        if (error instanceof Error && error.message.includes('token')) {
            return NextResponse.json({
                success: false,
                message: 'Authentication failed',
            }, { status: 401 });
        }

        return NextResponse.json({
            success: false,
            message: 'Internal server error',
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        // Validar token primero
        const token = await validateToken();

        if (!token) {
            console.error('No token provided or invalid token');
            return NextResponse.json({
                success: false,
                message: 'Authentication required',
            }, { status: 401 });
        }

        const url = new URL(req.url);
        const path = url.pathname;

        console.log('POST request received for path:', path);

        // Para crear un backup (ruta adaptada para /api/dash/backup)
        if (path.includes('/api/dash/backup') && !path.includes('/restore')) {
            try {
                console.log('Creating backup...');

                const response = await axios.post(
                    `${process.env.GATEWAY_API}/admin/database/backup`,
                    {},  // Empty body object
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Cookie: `intranet-token=${token}`
                        },
                        timeout: 60000, // 60 seconds timeout for backup creation
                    }
                );

                console.log('Backup created successfully:', response.data);
                return NextResponse.json(response.data);

            } catch (error) {
                console.error('Error creating backup:', error);

                if (axios.isAxiosError(error)) {
                    console.error('Axios error details:', {
                        status: error.response?.status,
                        statusText: error.response?.statusText,
                        data: error.response?.data,
                        url: error.config?.url
                    });

                    if (error.response?.status === 401) {
                        return NextResponse.json({
                            success: false,
                            message: 'Unauthorized - Invalid or expired token',
                        }, { status: 401 });
                    } else if (error.response?.status === 403) {
                        return NextResponse.json({
                            success: false,
                            message: 'Forbidden - Insufficient permissions for backup creation',
                        }, { status: 403 });
                    }
                }

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

                console.log('Restoring backup from path:', body.backupPath);

                const response = await axios.post(
                    `${process.env.GATEWAY_API}/admin/database/restore`,
                    { backupPath: body.backupPath },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Cookie: `intranet-token=${token}`
                        },
                        timeout: 120000, // 120 seconds timeout for restore
                    }
                );

                console.log('Backup restored successfully:', response.data);
                return NextResponse.json(response.data);

            } catch (error) {
                console.error('Error restoring backup:', error);

                if (axios.isAxiosError(error)) {
                    console.error('Axios error details:', {
                        status: error.response?.status,
                        statusText: error.response?.statusText,
                        data: error.response?.data,
                        url: error.config?.url
                    });

                    if (error.response?.status === 401) {
                        return NextResponse.json({
                            success: false,
                            message: 'Unauthorized - Invalid or expired token',
                        }, { status: 401 });
                    } else if (error.response?.status === 403) {
                        return NextResponse.json({
                            success: false,
                            message: 'Forbidden - Insufficient permissions for backup restore',
                        }, { status: 403 });
                    }
                }

                return NextResponse.json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Failed to restore backup',
                }, { status: 500 });
            }
        }
        // Fallback para rutas POST desconocidas
        else {
            console.log('Unknown POST endpoint:', path);
            return NextResponse.json({
                success: false,
                message: 'Unknown endpoint',
            }, { status: 404 });
        }

    } catch (error) {
        console.error('Unexpected error in POST handler:', error);

        // Si el error es de validateToken, probablemente sea 401
        if (error instanceof Error && error.message.includes('token')) {
            return NextResponse.json({
                success: false,
                message: 'Authentication failed',
            }, { status: 401 });
        }

        return NextResponse.json({
            success: false,
            message: 'Internal server error',
        }, { status: 500 });
    }
}