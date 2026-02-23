import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const backendUrl = process.env.API_URL;

        const response = await fetch(`${backendUrl}/api/v1/assets`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${request.headers.get("Authorization")}`,
            },
        });

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json(
            { error: "Failed to fetch dashboard data" },
            { status: 500 }
        );
    }
}