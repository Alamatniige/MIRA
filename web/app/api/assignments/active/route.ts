import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  try {
    const response = await fetch(`${API_URL}/assign/active`, {
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    const text = await response.text();
    const data = (() => {
      try {
        return JSON.parse(text);
      } catch {
        return { message: text.trim() };
      }
    })();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Proxy GET active assignments Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
