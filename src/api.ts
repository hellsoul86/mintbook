import type { KlinesResponse, Summary } from './types';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export async function fetchSummary(): Promise<Summary> {
  const res = await fetch(`${API_BASE}/api/summary`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json() as Promise<Summary>;
}

export type FetchKlinesParams = {
  symbol: string;
  interval: string;
  start_time: number;
  end_time: number;
  limit: number;
  signal?: AbortSignal;
};

export async function fetchKlines(params: FetchKlinesParams): Promise<KlinesResponse> {
  const query = new URLSearchParams();
  query.set('symbol', params.symbol);
  query.set('intervals', params.interval);
  query.set('start_time', String(params.start_time));
  query.set('end_time', String(params.end_time));
  query.set('limit', String(params.limit));

  const res = await fetch(`${API_BASE}/api/klines?${query.toString()}`, {
    cache: 'no-store',
    signal: params.signal,
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json() as Promise<KlinesResponse>;
}
