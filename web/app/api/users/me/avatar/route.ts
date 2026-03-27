import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get("authorization");

    try {
        // Get the form data from the incoming request
        const formData = await req.formData();
        
        // Forward the request to the Go backend
        const response = await fetch(`${API_URL}/users/me/avatar`, {
            method: "POST",
            headers: {
                ...(authHeader ? { Authorization: authHeader } : {}),
                // Note: Don't set Content-Type header manually for FormData, 
                // let fetch set it with the correct boundary.
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { message: `Backend error: ${errorText || response.statusText}` }, 
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Proxy POST Avatar Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
