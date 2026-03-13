import type { Assignment } from "@/types/mira";
import { useCallback, useEffect, useState } from "react";


export function useAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("mira_token") : null;
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, []);

  const fetchAssignments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/assign`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch assignments");
      }

      setAssignments(Array.isArray(data) ? data : []);

    } catch (err: unknown) {
      console.error("Failed to fetch assignments:", err);
      setError(err instanceof Error ? err.message : "Failed to load assignments");
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders]);


  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return {
    assignments,
    isLoading,
    error,
    refresh: fetchAssignments,

  };
}

