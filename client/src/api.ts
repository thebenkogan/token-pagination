import { useEffect, useRef, useState } from "react";

const URL = "http://localhost:3000/";

async function fetchExtractions(
  token?: string,
  limit?: number
): Promise<ExtractionsResponse> {
  const params = new URLSearchParams();
  if (token) {
    params.append("continuation_token", token);
  }
  if (limit) {
    params.append("limit", limit.toString());
  }
  const res = await fetch(URL + "?" + params.toString());
  if (!res.ok) {
    throw new Error("failed to fetch");
  }
  return res.json();
}

export type Extraction = {
  id: string;
  name: string;
  created: string;
  status: "pending" | "completed" | "failed";
};

type ExtractionsResponse = {
  data: Extraction[];
  continuation_token: string;
};

export function useExtractions() {
  const [data, setData] = useState<Extraction[] | undefined>(undefined);
  const token = useRef<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [lastPageIndex, setLastPageIndex] = useState(0);

  useEffect(() => {
    if (isLoading) return;
    setIsLoading(true);
    fetchExtractions(token.current).then(({ data, continuation_token }) => {
      setData((currData) => [...(currData ?? []), ...data]);
      token.current = continuation_token;
      setPageIndex(lastPageIndex);
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastPageIndex]);

  useEffect(() => {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const pollableExtractions =
      data?.filter((e) => new Date(e.created) >= fifteenMinutesAgo) ?? [];
    const interval = setInterval(() => {
      const startToken = token.current;
      fetchExtractions(undefined, pollableExtractions.length).then(
        ({ data: newData }) => {
          if (newData.length === 0 || !data) return;
          if (token.current !== startToken) return; // this poll is stale
          const extractionsToKeep = data.filter(
            (e) => !newData.some((ne) => ne.id === e.id)
          );
          setData([...newData, ...extractionsToKeep]);
        }
      );
    }, 3_000);
    return () => clearInterval(interval);
  }, [data]);

  function onPageChange(newPageIndex: number) {
    if (isLoading) return;
    if (newPageIndex > lastPageIndex) {
      if (!token.current) return; // no more to fetch, ignore
      setLastPageIndex(newPageIndex);
    } else {
      setPageIndex(newPageIndex);
    }
  }

  return { data: data, isLoading, onPageChange, pageIndex };
}
