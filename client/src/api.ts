import { useEffect, useRef, useState } from "react";
import type { Extraction } from "../../server/data";

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

type ExtractionsResponse = {
  data: Extraction[];
  continuation_token: string;
};

const POLLING_INTERVAL_MS = 3_000;

export function useExtractions() {
  const [data, setData] = useState<Extraction[]>();
  const token = useRef<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [lastPageIndex, setLastPageIndex] = useState(0);

  // request synchronization refs
  const lastRequestId = useRef(0);
  const lastResponseId = useRef(0);

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
    if (isLoading || !data) return;
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const pollableExtractions =
      data.filter((e) => new Date(e.created) >= fifteenMinutesAgo) ?? [];
    const interval = setInterval(() => {
      const requestId = lastRequestId.current + 1;
      lastRequestId.current = requestId;
      fetchExtractions(undefined, pollableExtractions.length).then(
        ({ data: newData }) => {
          if (requestId < lastResponseId.current) return; // this poll is stale
          lastResponseId.current = requestId;
          setData((currData) => {
            const extractionsToKeep =
              currData?.filter((e) => !newData.some((ne) => ne.id === e.id)) ??
              [];
            return [...newData, ...extractionsToKeep];
          });
        }
      );
    }, POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [data, isLoading]);

  function onPageChange(newPageIndex: number) {
    if (isLoading) return;
    if (newPageIndex > lastPageIndex) {
      if (!token.current) return; // no more to fetch, ignore
      setLastPageIndex(newPageIndex);
    } else {
      setPageIndex(newPageIndex);
    }
  }

  return { data, isLoading, onPageChange, pageIndex };
}
