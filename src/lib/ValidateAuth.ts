import { cookies } from "next/headers";

/**
 * Función para validar el token JWT
 */
export async function validateToken(): Promise<string> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('intranet-token')?.value;

        if (!token) {
            throw new Error('No se encontró token en cookies');
        }
        
        // Decodificar y validar expiración del token
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            throw new Error('Formato de token inválido');
        }
        
        // Decodificar el payload (segunda parte del token)
        const base64Payload = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = Buffer.from(base64Payload, 'base64').toString('utf-8');
        const payload = JSON.parse(decodedPayload);
        
        // Verificar expiración
        if (payload.exp) {
            const expTime = new Date(payload.exp * 1000);
            const now = new Date();
            
            if (expTime < now) {
                throw new Error('Token expirado');
            }
        }
        
        // Si todo está bien, la función termina sin devolver nada (Promise<void>)
        return token;
    } catch (error: any) {
        // Lanzar el error para que sea manejado por quien llama a la función
        throw new Error(error.message || 'Token inválido o expirado');
    }
}