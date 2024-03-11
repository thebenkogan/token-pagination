import { QueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

const URL = "http://localhost:3000/";

async function fetcher(token?: string): Promise<ExtractionsResponse> {
  const params = token ? `?continuation_token=${token}` : "";
  const res = await fetch(URL + params);
  if (!res.ok) {
    throw new Error("failed to fetch");
  }
  return res.json();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // queryFn: fetcher,
    },
  },
});

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
    if (isLoading) return
    setIsLoading(true);
    fetcher(token.current).then(({ data, continuation_token }) => {
      setData((currData) => [...(currData ?? []), ...data]);
      token.current = continuation_token;
      setPageIndex(lastPageIndex)
      setIsLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastPageIndex]);

  function onPageChange(newPageIndex: number) {
    if (isLoading) return
    if (newPageIndex > lastPageIndex) {
      setLastPageIndex(newPageIndex);
    } else {
      setPageIndex(newPageIndex);
    }
  }

  return { data: data, isLoading, onPageChange, pageIndex };
}
