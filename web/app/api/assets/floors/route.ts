import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");

    try {
        const response = await fetch(`${API_URL}/assets/floors`, {
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
        console.error("Proxy GET Floors Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
