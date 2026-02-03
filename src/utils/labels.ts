import type { TFunction } from 'i18next';

export const directionWord = (dir: string | undefined, t: TFunction) => {
  if (dir === 'UP') return t('direction.up');
  if (dir === 'DOWN') return t('direction.down');
  return t('direction.flat');
};

export const judgmentLabel = (agentId: string, direction: string, t: TFunction) => {
  const word = directionWord(direction, t);
  if (agentId === 'bull_v1') return t('judgmentLabel.bull', { direction: word });
  if (agentId === 'bear_v1') return t('judgmentLabel.bear', { direction: word });
  if (agentId === 'chaos_v1') return t('judgmentLabel.chaos', { direction: word });
  return t('judgmentLabel.other', { direction: word });
};

export const statusLabel = (status: string | null | undefined, t: TFunction) => {
  if (status === 'locked') return t('statusLabel.locked');
  if (status === 'betting') return t('statusLabel.betting');
  if (status === 'settled') return t('statusLabel.settled');
  return status || '--';
};
