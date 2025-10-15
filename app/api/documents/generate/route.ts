import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: Generate Legal Document
 * POST /api/documents/generate
 * 
 * Generates a legal document based on type, title, and custom fields
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { document_type, title, fields = {}, conversation_context = [] } = body;

    if (!document_type || !title) {
      return NextResponse.json(
        { error: 'Document type and title are required' },
        { status: 400 }
      );
    }

    // Validate document type
    const validTypes = ['contract', 'agreement', 'letter', 'power_of_attorney', 'legal_opinion', 'complaint'];
    if (!validTypes.includes(document_type)) {
      return NextResponse.json(
        { error: `Invalid document type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Call Python backend document generation service
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/v1/documents/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        document_type,
        title,
        fields,
        conversation_context 
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Document generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
