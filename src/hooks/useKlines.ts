import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchKlines } from '../api';
import type { Kline } from '../types';

export type UseKlinesArgs = {
  symbol: string;
  interval: string;
  startTimeMs: number;
  endTimeMs: number;
  limit: number;
  refreshMs?: number;
};

export function useKlines(args: UseKlinesArgs) {
  const [data, setData] = useState<Kline[] | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const key = useMemo(() => {
    return [
      args.symbol,
      args.interval,
      args.startTimeMs,
      args.endTimeMs,
      args.limit,
    ].join('|');
  }, [args.symbol, args.interval, args.startTimeMs, args.endTimeMs, args.limit]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetchKlines({
          symbol: args.symbol,
          interval: args.interval,
          start_time: args.startTimeMs,
          end_time: args.endTimeMs,
          limit: args.limit,
          signal: controller.signal,
        });

        const candles = res.data?.[args.interval] ?? [];
        if (mounted) {
          setData(candles);
          setUpdatedAt(res.updated_at || null);
          setIsLoading(false);
        }
      } catch (err) {
        if (!mounted) return;
        const message = err instanceof Error ? err.message : 'Failed to load klines';
        setError(message);
        setIsLoading(false);
      }
    };

    void run();

    if (!args.refreshMs || args.refreshMs <= 0) {
      return () => {
        mounted = false;
        abortRef.current?.abort();
      };
    }

    const timer = setInterval(run, args.refreshMs);
    return () => {
      mounted = false;
      clearInterval(timer);
      abortRef.current?.abort();
    };
  }, [key, args.refreshMs, args.symbol, args.interval, args.startTimeMs, args.endTimeMs, args.limit]);

  return {
    data,
    updatedAt,
    isLoading,
    error,
  };
}
