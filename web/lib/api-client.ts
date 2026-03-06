const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function apiClient<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('mira_token') : null;

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const config: RequestInit = {
        ...options,
        headers,
    };

    // Ensure endpoint starts with /
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
        const response = await fetch(url, config);

        if (response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('mira_token');
                // We don't redirect here to avoid circular dependencies or unexpected behavior in non-UI code
            }
        }

        if (!response.ok) {
            let errorMessage = `API error: ${response.status}`;
            try {
                // Read body as text ONCE, then try to parse as JSON
                const rawText = await response.text();
                if (rawText) {
                    try {
                        const error = JSON.parse(rawText);
                        errorMessage = error.message || error.error || errorMessage;
                    } catch {
                        // Not JSON — use the raw text directly (e.g. plain http.Error from Go)
                        errorMessage = rawText;
                    }
                }
            } catch (readErr) {
                console.error('Failed to read error response body:', readErr);
                errorMessage = response.statusText;
            }
            throw new Error(errorMessage);
        }

        // Handle empty responses
        if (response.status === 204) {
            return {} as T;
        }

        return await response.json();
    } catch (error) {
        console.error('API Client Error:', error);
        throw error;
    }
}
