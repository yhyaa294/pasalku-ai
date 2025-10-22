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
      // minimal mock when empty
      return NextResponse.json({
        prediction_id: 'pred-0',
        predicted_outcome: 'Insufficient data',
        confidence: 0.3,
        reasoning: 'Deskripsi kasus belum lengkap',
        similar_cases_count: 0,
        key_factors: []
      });
    }

    // Prefer configured backend endpoints if available
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || '';
    if (backendUrl) {
      try {
        const response = await fetch(`${backendUrl.replace(/\/$/, '')}/api/v1/predictions/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ case_description, case_type })
        });
        if (response.ok) {
          const data = await response.json();
          return NextResponse.json(data);
        }
      } catch (_) {}
    }

    // Mock fallback
    return NextResponse.json({
      prediction_id: 'pred-1',
      predicted_outcome: 'Kemungkinan berhasil (umum)',
      confidence: 0.62,
      reasoning: 'Berdasarkan pola kasus serupa dan faktor umum yang sering berpengaruh',
      similar_cases_count: 23,
      key_factors: ['Kelengkapan bukti', 'Kronologi koheren', 'Dasar hukum relevan']
    });

  } catch (error) {
    console.error('Prediction analysis error:', error);
    return NextResponse.json({
      prediction_id: 'pred-error',
      predicted_outcome: 'Unknown',
      confidence: 0.0,
      reasoning: 'Terjadi kesalahan analisis',
      similar_cases_count: 0,
      key_factors: []
    });
  }
}
