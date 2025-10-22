import { NextResponse } from 'next/server';

export async function GET() {
  const backend = (process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');
  let connected = false;
  let kind: 'real' | 'mock' | 'unknown' = 'unknown';
  let endpointTried: string[] = [];

  try {
    // Try real backend first
    const url1 = `${backend}/api/health`;
    endpointTried.push(url1);
    const r1 = await fetch(url1, { cache: 'no-store' });
    if (r1.ok) {
      connected = true;
      kind = 'real';
      return NextResponse.json({ connected, url: backend, kind, endpointTried });
    }
  } catch {}

  try {
    // Try mock server fallback
    const url2 = `${backend}/health`;
    endpointTried.push(url2);
    const r2 = await fetch(url2, { cache: 'no-store' });
    if (r2.ok) {
      connected = true;
      kind = 'mock';
    }
  } catch {}

  return NextResponse.json({ connected, url: backend, kind, endpointTried });
}
