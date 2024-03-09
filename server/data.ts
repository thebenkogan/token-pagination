export type Extraction = {
  id: string;
  name: string;
  created: string;
  status: "pending" | "completed" | "failed";
};

const database: Extraction[] = [];
const ROWS = 10_000;

for (let i = 0; i < ROWS; i++) {
  database.push({
    id: crypto.randomUUID(),
    name: `Extraction ${i}`,
    created: new Date(Date.now() - Math.random() * 1e11).toISOString(),
    status: Math.random() > 0.2 ? "completed" : "failed",
  });
}
database.sort((a, b) => b.created.localeCompare(a.created));
for (let i = 0; i < 10; i++) {
  database[i].status = "pending";
}

type QueryResult = {
  data: Extraction[];
  continuation_token: number;
};

export async function query(start: number, size: number): Promise<QueryResult> {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
  return {
    data: database.slice(start, start + size),
    continuation_token: start + size,
  };
}
