// Temporarily disabled for MVP deployment
// import { handlers } from "@/lib/auth";

export async function GET() {
  return new Response(JSON.stringify({ message: 'Auth temporarily disabled for deployment' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST() {
  return new Response(JSON.stringify({ message: 'Auth temporarily disabled for deployment' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
