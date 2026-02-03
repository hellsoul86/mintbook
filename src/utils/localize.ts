import type { TFunction } from 'i18next';
import type { Agent, FlipCard } from '../types';

export function localizeAgent(agent: Agent, lang: string, t: TFunction): Agent {
  if (!lang.startsWith('en')) {
    return agent;
  }
  const persona = t(`persona.${agent.id}`, { defaultValue: agent.persona });
  return {
    ...agent,
    persona,
  };
}

export function localizeFlipCard(item: FlipCard, lang: string, t: TFunction): FlipCard {
  if (!lang.startsWith('en')) {
    return item;
  }

  const agentName = item.agent || item.agent_id;
  const title =
    item.result === 'FAIL'
      ? t('feed.titleFail', { agent: agentName })
      : t('feed.titleWin', { agent: agentName });

  const deltaMatch = item.text?.match(/[-+]?\d+(?:\.\d+)?%/);
  const delta = deltaMatch ? deltaMatch[0] : null;
  const text = delta
    ? t('feed.text', { confidence: item.confidence, delta })
    : item.text;

  return {
    ...item,
    title,
    text,
  };
}
