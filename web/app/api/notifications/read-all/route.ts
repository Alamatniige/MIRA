import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function PATCH(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  try {
    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    if (!response.ok) {
      const text = await response.text();
      let errBody: { code: string; message: string; details?: unknown };
      try {
        const body = JSON.parse(text);
        errBody = {
          code: 'BACKEND_ERROR',
          message: body.message || body.error || `Backend error: ${response.status}`,
          details: body,
        };
      } catch {
        errBody = {
          code: 'BACKEND_ERROR',
          message: text.trim() || `Backend error: ${response.status}`,
        };
      }
      return NextResponse.json(errBody, { status: response.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Proxy PATCH /notifications/read-all error:', error);
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
