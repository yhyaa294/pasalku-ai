import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: Validate Citation
 * POST /api/citations/validate
 * 
 * Validates if a citation exists in the database
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { citation } = body;

    if (!citation) {
      return NextResponse.json(
        { error: 'Citation is required' },
        { status: 400 }
      );
    }

    // Call Python backend citation validation service
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/v1/citations/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ citation }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Citation validation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to validate citation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
