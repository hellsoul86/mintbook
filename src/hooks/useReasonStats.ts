import { useCallback, useEffect, useState } from 'react';
import { fetchReasonStats } from '../api';
import type { ReasonStatsResponse } from '../types';

const REFRESH_MS = 15_000;

export function useReasonStats() {
  const [stats, setStats] = useState<ReasonStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchReasonStats();
      setStats(data);
      setUpdatedAt(Date.now());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(timer);
  }, [refresh]);

  return {
    stats,
    isLoading,
    error,
    updatedAt,
  };
}
