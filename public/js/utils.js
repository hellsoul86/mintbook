export const directionLabel = (dir) => {
  if (dir === 'UP') return '涨';
  if (dir === 'DOWN') return '跌';
  return '平';
};

export const formatPrice = (price) => {
  if (typeof price !== 'number') return '--';
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDelta = (value, digits = 1) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '--';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(digits)}%`;
};

export const formatCountdown = (ms) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const min = String(Math.floor(total / 60)).padStart(2, '0');
  const sec = String(total % 60).padStart(2, '0');
  return `${min}:${sec}`;
};
