import { useState, useEffect, useCallback } from "react";
import { User } from "@/types/mira";


export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getHeaders = useCallback(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("mira_token") : null;
        return {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    }, []);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/users", {
                headers: getHeaders(),
            });
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            setUsers(data || []);
        } catch (err: any) {
            console.error("Failed to fetch users:", err);
            setError(err.message || "Failed to load users");
        } finally {
            setIsLoading(false);
        }
    }, [getHeaders]);

    const addUser = useCallback(async (userData: Partial<User>) => {
        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(userData),
            });
            if (!response.ok) throw new Error("Failed to add user");
            await fetchUsers();
            return await response.json();
        } catch (err: any) {
            console.error("Failed to add user:", err);
            throw err;
        }
    }, [getHeaders, fetchUsers]);

    const deleteUser = useCallback(async (id: string) => {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: "DELETE",
                headers: getHeaders(),
            });
            if (!response.ok) throw new Error("Failed to delete user");
            await fetchUsers();
        } catch (err: any) {
            console.error("Failed to delete user:", err);
            throw err;
        }
    }, [getHeaders, fetchUsers]);

    const getCurrentUser = useCallback(async (): Promise<User> => {
        try {
            const response = await fetch("/api/users/me", {
                headers: getHeaders(),
            });
            if (!response.ok) throw new Error("Failed to fetch current user");
            const data = await response.json();
            // Handle array or object based on backend implementation
            return Array.isArray(data) ? data[0] : data;
        } catch (err: any) {
            console.error("Failed to fetch current user:", err);
            throw err;
        }
    }, [getHeaders]);

    const updateUser = useCallback(async (id: string, userData: Partial<User>) => {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(userData),
            });
            if (!response.ok) throw new Error("Failed to update user");
            await fetchUsers();
            return await response.json();
        } catch (err: any) {
            console.error("Failed to update user:", err);
            throw err;
        }
    }, [getHeaders, fetchUsers]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        isLoading,
        error,
        refresh: fetchUsers,
        addUser,
        deleteUser,
        getCurrentUser,
        updateUser,
    };
}
