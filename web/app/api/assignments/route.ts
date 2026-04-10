import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function extractErrorBody(response: Response, fallback: string) {
  const text = await response.text();
  try {
    const body = JSON.parse(text);
    return {
      code: 'BACKEND_ERROR',
      message: body.message || body.error || fallback,
      details: body,
    };
  } catch {
    return { code: 'BACKEND_ERROR', message: text.trim() || fallback };
  }
}

// Get All Assignments
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  try {
    const response = await fetch(`${API_URL}/assign`, {
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    if (!response.ok) {
      const err = await extractErrorBody(response, `Backend error: ${response.status}`);
      return NextResponse.json(err, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy GET Error:', error);
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}

// Create Assignment
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  try {
    const body = await req.json();
    const response = await fetch(`${API_URL}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await extractErrorBody(response, `Backend error: ${response.status}`);
      return NextResponse.json(err, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Proxy POST Error:', error);
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
