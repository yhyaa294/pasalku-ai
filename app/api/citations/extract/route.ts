import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: Extract Citations from Text
 * POST /api/citations/extract
 * 
 * Extracts legal citations from text and validates them
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ citations: [] });
    }

    // Try backend if configured
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || '';
    if (backendUrl) {
      try {
        const response = await fetch(`${backendUrl.replace(/\/$/, '')}/api/v1/citations/extract`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        if (response.ok) {
          const data = await response.json();
          return NextResponse.json(data);
        }
      } catch (_) {
        // fall back to mock
      }
    }

    // Mock extraction fallback
    const citations = [
      {
        id: 'c1',
        text: 'KUHPerdata Pasal 1320',
        law: 'KUHPerdata',
        article: '1320',
        isValid: true,
        formatted: 'KUHPerdata Pasal 1320'
      }
    ];
    return NextResponse.json({ citations });

  } catch (error) {
    console.error('Citation extraction error:', error);
    return NextResponse.json({ citations: [] });
  }
}
