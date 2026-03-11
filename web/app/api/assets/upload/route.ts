import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const incomingFormData = await req.formData();
    
    // Pass the FormData identically to backend
    const response = await fetch(`${API_BASE_URL}/assets/upload`, {
      method: "POST",
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: incomingFormData,
    });

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { error: text };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to upload image" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
