import type { KlinesResponse, ReasonStatsResponse, Summary } from './types';

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
  start_time?: number;
  end_time?: number;
  limit: number;
  signal?: AbortSignal;
};

export async function fetchKlines(params: FetchKlinesParams): Promise<KlinesResponse> {
  const query = new URLSearchParams();
  query.set('symbol', params.symbol);
  query.set('intervals', params.interval);
  if (typeof params.start_time === 'number') {
    query.set('start_time', String(params.start_time));
  }
  if (typeof params.end_time === 'number') {
    query.set('end_time', String(params.end_time));
  }
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

export type FetchReasonStatsParams = {
  since?: string | number;
  until?: string | number;
  limit?: number;
  signal?: AbortSignal;
};

export async function fetchReasonStats(
  params: FetchReasonStatsParams = {}
): Promise<ReasonStatsResponse> {
  const query = new URLSearchParams();
  if (params.since !== undefined) {
    query.set('since', String(params.since));
  }
  if (params.until !== undefined) {
    query.set('until', String(params.until));
  }
  if (typeof params.limit === 'number') {
    query.set('limit', String(params.limit));
  }

  const url = query.toString()
    ? `${API_BASE}/api/reason-stats?${query.toString()}`
    : `${API_BASE}/api/reason-stats`;

  const res = await fetch(url, { cache: 'no-store', signal: params.signal });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json() as Promise<ReasonStatsResponse>;
}
