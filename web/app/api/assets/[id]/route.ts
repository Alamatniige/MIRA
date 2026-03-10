import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Update Asset
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }) {

    const authHeader = req.headers.get("authorization");
    const id = (await params).id;

    try {
        const body = await req.json();
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
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }) {

    const authHeader = req.headers.get("authorization");
    const id = (await params).id;

    try {
        const response = await fetch(`${API_URL}/assets/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
        });

        if (!response.ok) {
            const text = await response.text();
            try {
                return NextResponse.json(JSON.parse(text), { status: response.status });
            } catch {
                return NextResponse.json({ message: text }, { status: response.status });
            }
        }

        return NextResponse.json({ success: true, status: response.status });
    } catch (error) {
        console.error("Proxy DELETE Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
