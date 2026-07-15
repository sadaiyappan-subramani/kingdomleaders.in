import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const nestjsApiUrl = process.env.NESTJS_API_URL || 'http://localhost:3001';

    const response = await fetch(`${nestjsApiUrl}/registrations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NestJS backend returned status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`Error updating registration ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update registration' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const nestjsApiUrl = process.env.NESTJS_API_URL || 'http://localhost:3001';

    const response = await fetch(`${nestjsApiUrl}/registrations/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NestJS backend returned status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`Error deleting registration ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete registration' },
      { status: 500 }
    );
  }
}
