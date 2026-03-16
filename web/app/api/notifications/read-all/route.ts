import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function PUT(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  try {
    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: `Backend error: ${response.status}` },
        { status: response.status },
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Proxy PUT /notifications/read-all error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
