"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient } from './api-client';

interface User {
    id: string;
    email: string;
    full_name?: string;
    role?: {
        name: string;
    };
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Hydrate from localStorage
        const savedToken = localStorage.getItem('mira_token');
        const savedUser = localStorage.getItem('mira_user');

        if (savedToken && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser) as User;

                // RBAC: Only Admins are allowed in this console
                if (parsedUser.role?.name !== 'Admin') {
                    console.warn("Non-admin user session detected during hydration. Clearing session.");
                    logout();
                    return;
                }

                setToken(savedToken);
                setUser(parsedUser);
            } catch (e) {
                console.error("Failed to parse saved user", e);
                logout();
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await apiClient<{ message: string; data: { access_token: string; user: User } }>('/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            const { access_token, user: userData } = response.data;

            // RBAC: Check if user is an Admin
            if (userData.role?.name !== 'Admin') {
                throw new Error("Access denied. Only administrators are allowed to enter the IT Admin Console.");
            }

            setToken(access_token);
            setUser(userData);
            localStorage.setItem('mira_token', access_token);
            localStorage.setItem('mira_user', JSON.stringify(userData));

            router.push('/dashboard');
        } catch (error: any) {
            console.error('Login error:', error);

            // Map common error patterns to user-friendly messages
            const message = error.message || '';
            if (message.toLowerCase().includes('unauthorized') ||
                message.toLowerCase().includes('invalid login credentials') ||
                message.toLowerCase().includes('login failed')) {
                throw new Error("Invalid email or password. Please try again.");
            }

            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('mira_token');
        localStorage.removeItem('mira_user');
        router.push('/login');
    };

    // Public routes that don't require authentication
    const publicRoutes = ['/login'];
    const isPublicRoute = publicRoutes.includes(pathname);

    useEffect(() => {
        if (!isLoading && !token && !isPublicRoute) {
            router.push('/login');
        }
    }, [isLoading, token, pathname, isPublicRoute, router]);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
