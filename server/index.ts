import { query } from "./data";

const PORT = 3000;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, GET",
  "Access-Control-Allow-Headers": "Content-Type",
};

Bun.serve({
  port: PORT,
  async fetch(req) {
    const params = new URL(req.url).searchParams;
    const startKey = Number(params.get("continuation_token") ?? 0);
    const data = await query(startKey, 10);
    return new Response(JSON.stringify(data), {
      headers: { ...CORS_HEADERS, "content-type": "application/json" },
    });
  },
});

console.log(`Listening on http://localhost:${PORT}/`);
