import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: Analyze Case for Outcome Prediction
 * POST /api/predictions/analyze
 * 
 * Analyzes a legal case and predicts possible outcomes
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { case_description, case_type = 'general' } = body;

    if (!case_description) {
      return NextResponse.json(
        { error: 'Case description is required' },
        { status: 400 }
      );
    }

    // Call Python backend prediction service
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/v1/predictions/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        case_description,
        case_type 
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Prediction analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze case',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
