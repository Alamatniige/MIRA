import {NextRequest, NextResponse} from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Get All Assignments
export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    try {
        const response = await fetch(`${API_URL}/assign`, {
            headers: {
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
        });
        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error("Proxy GET Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }

}