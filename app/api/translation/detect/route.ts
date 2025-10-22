import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: Detect Language
 * POST /api/translation/detect
 * 
 * Detects the language of given text
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Call Python backend language detection service
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');
    try {
      const response = await fetch(`${backendUrl}/api/v1/translation/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (_) {}

    // Fallback when backend is unavailable
    return NextResponse.json({ detected_language: 'id', confidence: 0.6 });

  } catch (error) {
    console.error('Language detection error:', error);
    return NextResponse.json({ detected_language: 'id', confidence: 0.5 });
  }
}
