import { query } from "./data";

const PORT = 3000;

Bun.serve({
  port: PORT,
  fetch(req) {
    const params = new URL(req.url).searchParams;
    const startKey = Number(params.get("continuation_token") ?? 0);

    return new Response(JSON.stringify(query(startKey, 10)), {
      headers: { "content-type": "application/json" },
    });
  },
});

console.log(`Listening on http://localhost:${PORT}/`);
