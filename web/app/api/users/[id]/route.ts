import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authHeader = req.headers.get("authorization");
    const { id } = await params;

    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: "DELETE",
            headers: {
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
        });

        if (!response.ok) {
            return NextResponse.json({ message: `Backend error: ${response.status}` }, { status: response.status });
        }

        // Go backend returns no body on success usually, but let's handle it
        const text = await response.text();
        const data = text ? JSON.parse(text) : { message: "Deleted successfully" };

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Proxy DELETE Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authHeader = req.headers.get("authorization");
    const { id } = await params;
    const body = await req.json();

    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            return NextResponse.json({ message: `Backend error: ${response.status}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Proxy PUT Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
