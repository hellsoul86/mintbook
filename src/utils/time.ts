export function formatRange(
  startIso: string | null | undefined,
  endIso: string | null | undefined,
  locale: string
): string {
  if (!startIso || !endIso) return '--';
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) return '--';

  const opts: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const startText = start.toLocaleString(locale, opts);
  const endText = end.toLocaleString(locale, opts);
  return `${startText} → ${endText}`;
}
