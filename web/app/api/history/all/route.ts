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

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  try {
    const response = await fetch(`${API_URL}/history/all`, {
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    if (!response.ok) {
      const err = await extractErrorBody(response, `Backend error: ${response.status}`);
      return NextResponse.json(err, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy History All GET Error:', error);
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
