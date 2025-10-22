import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: Translate Text
 * POST /api/translation/translate
 * 
 * Translates text from source language to target language
 * with legal terminology preservation
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, source_lang, target_lang, preserve_legal_terms = true } = body;

    if (!text || !target_lang) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    // Validate language codes
    const validLangs = ['id', 'en', 'jv', 'su', 'min', 'ban'];
    if (target_lang && !validLangs.includes(target_lang)) {
      return NextResponse.json(
        { error: `Invalid target language. Must be one of: ${validLangs.join(', ')}` },
        { status: 400 }
      );
    }

    if (source_lang && !validLangs.includes(source_lang)) {
      return NextResponse.json(
        { error: `Invalid source language. Must be one of: ${validLangs.join(', ')}` },
        { status: 400 }
      );
    }

    // Call Python backend translation service
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');
    try {
      const response = await fetch(`${backendUrl}/api/v1/translation/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, source_lang, target_lang, preserve_legal_terms }),
      });
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (_) {}

    // Fallback basic echo translation when backend is unavailable
    return NextResponse.json({ translated_text: text, source_lang: source_lang || 'id', target_lang });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ translated_text: '', source_lang: 'id', target_lang: 'id' });
  }
}
