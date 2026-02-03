import { AgentsList } from './components/AgentsList';
import { FeedList } from './components/FeedList';
import { HeroHeader } from './components/HeroHeader';
import { LivePanel } from './components/LivePanel';
import { OfflineBanner } from './components/OfflineBanner';
import { VerdictCard } from './components/VerdictCard';
import { useCountdown } from './hooks/useCountdown';
import { useSummary } from './hooks/useSummary';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export function App() {
  const { summary, isOnline, lastSync, impact } = useSummary();
  const countdown = useCountdown(summary?.live?.end_time ?? null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t('app.title');
    document.documentElement.lang = i18n.language.startsWith('zh') ? 'zh' : 'en';
  }, [t, i18n.language]);

  return (
    <div className="page">
      <div className="motto">{t('app.motto')}</div>
      <HeroHeader
        isOnline={isOnline}
        serverTime={summary?.server_time ?? null}
        lastSync={lastSync}
        symbol={summary?.live?.symbol ?? 'BTCUSDT'}
      />
      <OfflineBanner show={!isOnline} />
      <main>
        <LivePanel live={summary?.live ?? null} countdown={countdown} />
        <VerdictCard
          lastVerdict={summary?.lastVerdict ?? null}
          highlight={summary?.highlight ?? null}
          impact={impact}
        />
        <AgentsList agents={summary?.agents ?? []} />
        <FeedList feed={summary?.feed ?? []} />
      </main>
    </div>
  );
}
