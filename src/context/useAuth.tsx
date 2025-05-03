"use client"

import { AuthContextType, AuthState, LoadingState } from "@/types/intranet";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        isLoading: true,
        error: null,
        user: null
    });

    const [loadingStates, setLoadingStates] = useState<Record<string, LoadingState>>({});
    const router = useRouter();

    // Check authentication status on mount
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const res = await axios.get("/api/auth/me", { withCredentials: true });
                if (!res) console.log("No se pudo obtener info de la session")
                if (res.data.success && res.data.data?.user) {
                    setAuthState({
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                        user: res.data.data.user
                    });
                } else {
                    setAuthState(prev => ({ ...prev, isLoading: false }));
                }
            } catch (error) {
                setAuthState(prev => ({
                    ...prev,
                    isLoading: false,
                    isAuthenticated: false
                }));
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const res = await axios.post(
                "/api/auth/intranet",
                { email, password },
                { withCredentials: true }
            );

            if (!res.data.success || !res.data.data?.user) {
                throw new Error('Credenciales inválidas');
            }

            const { user } = res.data.data;

            setAuthState({
                isAuthenticated: true,
                isLoading: false,
                error: null,
                user
            });

            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || 'Error al iniciar sesión';

            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                isAuthenticated: false,
                error: errorMessage
            }));

            toast.error(errorMessage);
            return false;
        }
    };

    const logout = async () => {
        try {
            // Call logout endpoint to invalidate token on server
            await axios.post("/api/auth/logout");
        } catch (error) {
            console.error("Error during logout:", error);
        }

        // Reset state
        setAuthState({
            isAuthenticated: false,
            isLoading: false,
            error: null,
            user: null
        });

        // Redirect to home page
        router.push('/');
    };

    // Role verification
    const hasRole = (roles: string | string[]): boolean => {
        if (!authState.user?.rol) return false;

        const userRole = authState.user.rol;
        const checkRoles = Array.isArray(roles) ? roles : [roles];

        return checkRoles.includes(userRole);
    };

    // Loading state management functions
    const startLoading = (key: string, message: string = 'Cargando...') => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: { isLoading: true, message, error: null }
        }));
    };

    const stopLoading = (key: string, error: string | null = null) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: { isLoading: false, message: '', error }
        }));
    };

    const getLoadingState = (key: string): LoadingState => {
        return loadingStates[key] || { isLoading: false, message: '', error: null };
    };

    const withLoading = async <T,>(
        key: string,
        loadingMessage: string,
        operation: () => Promise<T>
    ): Promise<{ success: boolean; data?: T; error?: string }> => {
        startLoading(key, loadingMessage);

        try {
            const result = await operation();
            stopLoading(key);
            return { success: true, data: result };
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || 'Error en la operación';
            stopLoading(key, errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    }

    return (
        <AuthContext.Provider value={{
            ...authState,
            login,
            logout,
            hasRole,
            startLoading,
            stopLoading,
            getLoadingState,
            withLoading,
            loadingStates
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};