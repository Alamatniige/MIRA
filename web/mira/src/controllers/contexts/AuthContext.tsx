"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { login as authLogin, logout as authLogout } from "@/features/auth/authService";

const AUTH_STORAGE_KEY = "mira_auth_user";

export interface AuthUser {
  email: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    return parsed?.email ? parsed : null;
  } catch {
    return null;
  }
}

function setStoredUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!email?.trim()) {
      return { success: false, error: "Email is required." };
    }
    if (!password?.trim()) {
      return { success: false, error: "Password is required." };
    }
    try {
      const result = await authLogin(email, password);
      if (result?.user) {
        const authUser: AuthUser = {
          email: result.user.email,
          name: result.user.name ?? email,
        };
        setUser(authUser);
        setStoredUser(authUser);
        return { success: true };
      }
      return { success: false, error: "Invalid credentials." };
    } catch {
      return { success: false, error: "Login failed. Please try again." };
    }
  }, []);

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
    setStoredUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
