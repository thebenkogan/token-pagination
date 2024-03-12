export type Extraction = {
  id: string;
  name: string;
  created: string;
  status: "pending" | "completed" | "failed";
};

const database: Extraction[] = [];
const ROWS = 1_000;

for (let i = 0; i < ROWS; i++) {
  database.push({
    id: crypto.randomUUID(),
    name: `Extraction ${i}`,
    created: new Date(Date.now() - Math.random() * 1e11).toISOString(),
    status: Math.random() > 0.2 ? "completed" : "failed",
  });
}
database.sort((a, b) => b.created.localeCompare(a.created));
for (let i = 0; i < 5; i++) {
  database[i].status = "pending";
  database[i].created = new Date(
    Date.now() - Math.random() * 1e6
  ).toISOString();
}

setInterval(() => {
  database.unshift({
    id: crypto.randomUUID(),
    name: `Extraction ${database.length}`,
    created: new Date().toISOString(),
    status: "pending",
  });
  const firstNonPending = database.findIndex((e) => e.status !== "pending");
  database[firstNonPending - 1].status =
    Math.random() > 0.2 ? "completed" : "failed";
  console.log(database.length);
}, 5_000);

type QueryResult = {
  data: Extraction[];
  continuation_token: string;
};

export async function query(
  size: number,
  startId?: string
): Promise<QueryResult> {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
  const start = startId ? database.findIndex((e) => e.id === startId) : 0;
  return {
    data: database.slice(start, start + size),
    continuation_token: database[start + size].id,
  };
}
