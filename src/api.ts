import type { Summary } from './types';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export async function fetchSummary(): Promise<Summary> {
  const res = await fetch(`${API_BASE}/api/summary`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json() as Promise<Summary>;
}
