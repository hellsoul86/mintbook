export const SUPPORTED_INTERVALS = ['1m', '3m', '5m', '15m', '30m', '1h', '4h', '12h', '1d'] as const;

export type SupportedInterval = (typeof SUPPORTED_INTERVALS)[number];

export function intervalToMs(interval: string): number {
  const trimmed = interval.trim();
  const unit = trimmed.slice(-1);
  const count = Number(trimmed.slice(0, -1));
  if (!Number.isFinite(count) || count <= 0) {
    throw new Error(`Invalid interval: ${interval}`);
  }
  if (unit === 'm') return count * 60 * 1000;
  if (unit === 'h') return count * 60 * 60 * 1000;
  if (unit === 'd') return count * 24 * 60 * 60 * 1000;
  throw new Error(`Invalid interval: ${interval}`);
}

export function computeLimit(rangeMs: number, interval: string): number {
  const intervalMs = intervalToMs(interval);
  const raw = Math.ceil(rangeMs / intervalMs) + 2;
  const normalized = Math.max(10, raw);
  return Math.min(500, normalized);
}

function candlesNeeded(rangeMs: number, interval: string): number {
  const intervalMs = intervalToMs(interval);
  return Math.ceil(rangeMs / intervalMs) + 2;
}

function normalizeIntervals(value: string[] | null | undefined): string[] {
  return (value || [])
    .map((item) => String(item).trim().toLowerCase())
    .filter(Boolean);
}

export function pickBestIntervalForRange(
  usedIntervals: string[] | null | undefined,
  rangeMs: number
): string {
  const cleaned = normalizeIntervals(usedIntervals);
  const candidates = cleaned.length > 0 ? cleaned : ['15m'];

  // Prefer smaller intervals as long as it doesn't exceed 500 candles.
  const sorted = [...new Set(candidates)].sort((a, b) => intervalToMs(a) - intervalToMs(b));

  const ok = sorted.find((interval) => candlesNeeded(rangeMs, interval) <= 500);
  return ok || sorted[sorted.length - 1] || '15m';
}
