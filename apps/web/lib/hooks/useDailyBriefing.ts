"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useDailyBriefing(contextId: string) {
  const { data, error, isLoading } = useSWR(
    `/api/daily-briefing?contextId=${contextId}`,
    fetcher,
    {
      refreshInterval: 30000 // subtle live feel without WebSockets
    }
  );

  return {
    snapshot: data?.snapshot,
    items: data?.items ?? [],
    isLoading,
    error
  };
}
