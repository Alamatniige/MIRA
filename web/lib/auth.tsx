'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient } from './api-client';

interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  role?: {
    name: string;
    permittedPages?: string[];
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
  sessionInvalidated: boolean;
  clearSessionInvalidated: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionInvalidated, setSessionInvalidated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setSessionInvalidated(true);
    window.addEventListener('mira:session-invalidated', handler);
    return () => window.removeEventListener('mira:session-invalidated', handler);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1) Hydrate from localStorage
    const savedToken = localStorage.getItem('mira_token');
    const savedUser = localStorage.getItem('mira_user');

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;

        // Set user to state since non-admins can now log in
        setToken(savedToken);
        setUser(parsedUser);

        // Silently refresh user data in background to pick up latest avatarUrl etc.
        fetch('/api/users/me', {
          headers: { Authorization: `Bearer ${savedToken}` },
        })
          .then((res) => res.ok ? res.json() : null)
          .then((freshData) => {
            if (freshData?.id) {
              const freshUser = { ...parsedUser, ...freshData };
              setUser(freshUser);
              localStorage.setItem('mira_user', JSON.stringify(freshUser));
            }
          })
          .catch(() => { }); // silent fail — stale data is fine
      } catch (e) {
        console.error('Failed to parse saved user', e);
        logout();
      }
    }
    setIsLoading(false);

    // 2) Global fetch interceptor to catch any hook that bypasses apiClient
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (response.status === 401) {
          const clone = response.clone();
          try {
            const text = await clone.text();
            if (text.toLowerCase().includes('session invalidated')) {
              window.dispatchEvent(new CustomEvent('mira:session-invalidated', { detail: 'global-fetch' }));
            }
          } catch (e) {
            // ignore clone errors
          }
        }
        return response;
      } catch (err) {
        throw err;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient<{
        message: string;
        data: { access_token: string; user: User };
      }>('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const { access_token, user: userData } = response.data;

      setToken(access_token);
      setUser(userData);
      localStorage.setItem('mira_token', access_token);
      localStorage.setItem('mira_user', JSON.stringify(userData));

      let redirectPath = '/dashboard';
      if (userData.role?.name !== 'Admin') {
        const permitted = userData.role?.permittedPages || [];
        if (!permitted.includes('Dashboard')) {
          const routeReverseMap: Record<string, string> = {
            'Assets': '/asset',
            'Assignments': '/assignment',
            'Reports': '/report',
            'Users': '/users'
          };
          const firstPermitted = permitted.find(p => routeReverseMap[p]);
          if (firstPermitted) {
            redirectPath = routeReverseMap[firstPermitted];
          }
        }
      }

      router.push(redirectPath);
    } catch (error: any) {
      console.error('Login error:', error);

      // Map common error patterns to user-friendly messages
      const message = error.message || '';
      if (
        message.toLowerCase().includes('unauthorized') ||
        message.toLowerCase().includes('invalid login credentials') ||
        message.toLowerCase().includes('login failed')
      ) {
        throw new Error('Invalid email or password. Please try again.');
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        // Call the backend logout API, we ignore errors since we're clearing local state anyway
        await apiClient('/logout', { method: 'POST' }).catch(() => { });
      } else {
        // Just to give the UI a tiny moment to show the spinner if there's no backend request
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('mira_token');
      localStorage.removeItem('mira_user');
      router.push('/login');
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('mira_user', JSON.stringify(updatedUser));
    }
  };

  const clearSessionInvalidated = () => setSessionInvalidated(false);

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/forgot-password', '/setup-password'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!isLoading && !token && !isPublicRoute) {
      router.push('/login');
      return;
    }

    if (!isLoading && user && !isPublicRoute) {
      if (user.role?.name === 'Admin') return;

      const pathMap: Record<string, string> = {
        '/dashboard': 'Dashboard',
        '/asset': 'Assets',
        '/assignment': 'Assignments',
        '/report': 'Reports',
        '/users': 'Users',
        '/audit-logs': 'Audit Logs',
        '/asset-logs': 'Asset Logs',
      };

      const getFallbackPathInternal = () => {
        const routeReverseMap: Record<string, string> = {
          'Dashboard': '/dashboard',
          'Assets': '/asset',
          'Assignments': '/assignment',
          'Reports': '/report',
          'Users': '/users',
          'Audit Logs': '/audit-logs',
          'Asset Logs': '/asset-logs'
        };
        const firstPermitted = user.role?.permittedPages?.find(p => routeReverseMap[p]);
        return firstPermitted ? routeReverseMap[firstPermitted] : '/login'; // Or some ultimate fallback
      };

      if (pathname.startsWith('/audit-logs')) {
        if (user.role?.name === 'Admin') return;
        router.push(getFallbackPathInternal());
        return;
      }

      if (pathname.startsWith('/asset-logs')) {
        if (user.role?.name !== 'Staff') return;
        router.push(getFallbackPathInternal());
        return;
      }

      const activeModule = Object.keys(pathMap).find(p => pathname === p || pathname.startsWith(p + '/'));

      // Also handle root pathname specifically if not admin and they hit '/'
      if (pathname === '/' && !user.role?.permittedPages?.includes('Dashboard')) {
        router.push(getFallbackPathInternal());
        return;
      }

      if (activeModule) {
        const requiredPerm = pathMap[activeModule];
        const isPermitted = user.role?.permittedPages?.includes(requiredPerm);
        if (!isPermitted) {
          router.push(getFallbackPathInternal());
          return;
        }
      }

      if (pathname.startsWith('/settings')) {
        router.push(getFallbackPathInternal());
      }
    }
  }, [isLoading, token, pathname, isPublicRoute, router, user]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isLoading, sessionInvalidated, clearSessionInvalidated }}>
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
