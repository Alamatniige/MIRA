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

// Get All Assets
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  try {
    const response = await fetch(`${API_URL}/assets`, {
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
    console.error('Proxy GET Error:', error);
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}

// Add Asset
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const body = await req.json();

  try {
    const response = await fetch(`${API_URL}/assets`, {
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
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy POST Error:', error);
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}

// Update Asset
export async function PUT(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const body = await req.json();

  const id = req.nextUrl.pathname.split('/').pop();

  try {
    const response = await fetch(`${API_URL}/assets/${id}`, {
      method: 'PUT',
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
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy PUT Error:', error);
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}

// Delete Asset
export async function DELETE(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const body = await req.json();

  const id = req.nextUrl.pathname.split('/').pop();

  try {
    const response = await fetch(`${API_URL}/assets/${id}`, {
      method: 'DELETE',
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
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy DELETE Error:', error);
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
