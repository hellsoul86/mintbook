import { API_BASE } from './config.js';

export async function fetchSummary() {
  const res = await fetch(`${API_BASE}/api/summary`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}
