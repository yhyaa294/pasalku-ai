import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

console.log("thread-summarizer function loaded")

serve(async (req) => {
  // TODO: Add your thread summarizer logic here
  const { messages } = await req.json()

  // Example implementation
  const summary = messages.map(msg => msg.content).join('\n')

  return new Response(
    JSON.stringify({
      summary: summary,
      status: "success"
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    },
  )
})
