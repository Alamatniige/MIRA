import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Get All Assignments
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  try {
    const response = await fetch(`${API_URL}/assign`, {
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });
    const data = await parseBody(response);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy GET Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
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
    const data = await parseBody(response);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Proxy POST Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

async function parseBody(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { message: text.trim() };
  }
}
