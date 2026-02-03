export const formatPrice = (price: number | null | undefined, locale: string) => {
  if (typeof price !== 'number') return '--';
  return price.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDelta = (value?: number | null, digits = 1) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '--';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(digits)}%`;
};

export const formatTime = (value: string | number | null | undefined, locale: string) => {
  const time = value ? new Date(value) : new Date();
  return time.toLocaleTimeString(locale, { hour12: false });
};

export const formatCountdown = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const min = String(Math.floor(total / 60)).padStart(2, '0');
  const sec = String(total % 60).padStart(2, '0');
  return `${min}:${sec}`;
};
