import { randomUUID } from "crypto";

export type Extraction = {
  id: string;
  configuration: string;
  created: string;
  status: "pending" | "completed" | "failed";
};

const database: Extraction[] = [];
const ROWS = 100;

for (let i = 0; i < ROWS; i++) {
  database.push({
    id: randomUUID(),
    configuration: `Configuration ${Math.floor(Math.random() * 5) + 1}`,
    created: new Date(Date.now() - Math.random() * 1e11).toISOString(),
    status: Math.random() > 0.3 ? "completed" : "failed",
  });
}
for (let i = 0; i < 5; i++) {
  database[i]!.status = "pending";
  database[i]!.created = new Date().toISOString();
}

database.sort((a, b) => b.created.localeCompare(a.created));

setInterval(() => {
  if (Math.random() > 0.2) {
    const firstNonPending = database.findIndex((e) => e.status !== "pending");
    if (firstNonPending > 0) {
      database[firstNonPending - 1]!.status =
        Math.random() > 0.3 ? "completed" : "failed";
    }
  }

  if (Math.random() > 0.5) {
    database.unshift({
      id: randomUUID(),
      configuration: `Configuration ${Math.floor(Math.random() * 5) + 1}`,
      created: new Date().toISOString(),
      status: "pending",
    });
  }
}, 5_000);

type QueryResult = {
  data: Extraction[];
  continuation_token: string | null;
};

export async function query(
  size: number,
  startId?: string
): Promise<QueryResult> {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
  const start = Math.max(
    startId ? database.findIndex((e) => e.id === startId) : 0,
    0
  );
  return {
    data: database.slice(start, start + size),
    continuation_token: database[start + size]?.id ?? null,
  };
}
