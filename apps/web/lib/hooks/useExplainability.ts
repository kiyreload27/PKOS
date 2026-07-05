"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useExplainability(itemId?: string) {
  const { data, isLoading } = useSWR(
    itemId ? `/api/explain?itemId=${itemId}` : null,
    fetcher
  );

  return {
    explanation: data,
    isLoading
  };
}
