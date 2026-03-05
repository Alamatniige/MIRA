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
                const error = await response.json();
                errorMessage = error.message || error.error || errorMessage;
            } catch (e) {
                // If it's not JSON, it might be plain text from http.Error
                try {
                    const text = await response.text();
                    if (text) errorMessage = text;
                } catch (textErr) {
                    console.error('Failed to parse error response:', textErr);
                    errorMessage = response.statusText;
                }
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
