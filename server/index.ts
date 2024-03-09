import { query } from "./data";

const PORT = 3000;

Bun.serve({
  port: PORT,
  async fetch(req) {
    const params = new URL(req.url).searchParams;
    const startKey = Number(params.get("continuation_token") ?? 0);
    const data = await query(startKey, 10);
    return new Response(JSON.stringify(data), {
      headers: { "content-type": "application/json" },
    });
  },
});

console.log(`Listening on http://localhost:${PORT}/`);
