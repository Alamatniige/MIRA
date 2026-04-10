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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = req.headers.get('authorization');
  const { id } = await params;
  try {
    const response = await fetch(`${API_URL}/assign/${id}/confirm`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    if (!response.ok) {
      const err = await extractErrorBody(response, `Backend error: ${response.status}`);
      return NextResponse.json(err, { status: response.status });
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy PUT confirm Error:', error);
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
