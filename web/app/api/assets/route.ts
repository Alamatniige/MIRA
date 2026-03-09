import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Get All Assets
export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");

    try {
        const response = await fetch(`${API_URL}/assets`, {
            headers: {
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
        });

        if (!response.ok) {
            return NextResponse.json({ message: `Backend error: ${response.status}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Proxy GET Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// Add Asset
export async function POST(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const body = await req.json();

    try {
        const response = await fetch(`${API_URL}/assets`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const text = await response.text();
            try {
                return NextResponse.json(JSON.parse(text), { status: response.status });
            } catch {
                return NextResponse.json({ message: text }, { status: response.status });
            }
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Proxy POST Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// Update Asset
export async function PUT(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const body = await req.json();

    const id = req.nextUrl.pathname.split("/").pop();

    try {
        const response = await fetch(`${API_URL}/assets/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const text = await response.text();
            try {
                return NextResponse.json(JSON.parse(text), { status: response.status });
            } catch {
                return NextResponse.json({ message: text }, { status: response.status });
            }
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Proxy PUT Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// Delete Asset
export async function DELETE(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const body = await req.json();

    const id = req.nextUrl.pathname.split("/").pop();

    try {
        const response = await fetch(`${API_URL}/assets/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const text = await response.text();
            try {
                return NextResponse.json(JSON.parse(text), { status: response.status });
            } catch {
                return NextResponse.json({ message: text }, { status: response.status });
            }
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Proxy DELETE Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}