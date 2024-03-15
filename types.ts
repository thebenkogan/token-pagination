export type Extraction = {
  id: string;
  name: string;
  created: string;
  status: "pending" | "completed" | "failed";
};
