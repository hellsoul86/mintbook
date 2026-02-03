export const directionWord = (dir) => {
  if (dir === 'UP') return '上涨';
  if (dir === 'DOWN') return '下跌';
  return '横盘';
};

export const judgmentLabel = (agentId, direction) => {
  const word = directionWord(direction);
  if (agentId === 'bull_v1') return `断言${word}`;
  if (agentId === 'bear_v1') return `宣判${word}`;
  if (agentId === 'chaos_v1') return `强行站队${word}`;
  return `立场${word}`;
};

export const statusLabel = (status) => {
  if (status === 'locked') return '锁死';
  if (status === 'betting') return '封盘';
  if (status === 'settled') return '结案';
  return status || '--';
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
