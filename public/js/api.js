export async function fetchSummary() {
  const res = await fetch('/api/summary', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}
