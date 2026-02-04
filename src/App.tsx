import { AgentsList } from './components/AgentsList';
import { FeedList } from './components/FeedList';
import { HeroHeader } from './components/HeroHeader';
import { OfflineBanner } from './components/OfflineBanner';
import { MarketPanel } from './components/MarketPanel';
import { ReasonsPanel } from './components/ReasonsPanel';
import { useSummary } from './hooks/useSummary';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { pickBestIntervalForRange, SUPPORTED_INTERVALS } from './utils/intervals';

export function App() {
  const { summary, isOnline, lastSync } = useSummary();
  const { t, i18n } = useTranslation();

  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState<'auto' | 'manual'>('auto');
  const [selectedInterval, setSelectedInterval] = useState<string>(() => {
    try {
      const raw = localStorage.getItem('mintbook_interval') || '15m';
      return SUPPORTED_INTERVALS.includes(raw as any) ? raw : '15m';
    } catch {
      return '15m';
    }
  });

  const lastRoundIdRef = useRef<string | null>(null);

  useEffect(() => {
    document.title = t('app.title');
    document.documentElement.lang = i18n.language.startsWith('zh') ? 'zh' : 'en';
  }, [t, i18n.language]);

  useEffect(() => {
    try {
      localStorage.setItem('mintbook_interval', selectedInterval);
    } catch {
      // ignore
    }
  }, [selectedInterval]);

  const live = summary?.live ?? null;
  const judgments = live?.judgments ?? [];

  useEffect(() => {
    const roundId = live?.round_id ?? null;
    if (roundId && roundId !== lastRoundIdRef.current) {
      lastRoundIdRef.current = roundId;
      setSelectionMode('auto');
      setSelectedAgentId(null);
      setSelectedInterval('15m');
    }
    if (!roundId) {
      lastRoundIdRef.current = null;
      setSelectionMode('auto');
      setSelectedAgentId(null);
      setSelectedInterval('15m');
    }
  }, [live?.round_id]);

  // Default to the highest-confidence judgment if nothing is selected, or if the selection vanished.
  useEffect(() => {
    if (!live) {
      setSelectedAgentId(null);
      return;
    }
    if (!judgments || judgments.length === 0) {
      setSelectedAgentId(null);
      return;
    }

    const exists = selectedAgentId && judgments.some((j) => j.agent_id === selectedAgentId);
    const best = judgments.reduce((acc, cur) => (cur.confidence > acc.confidence ? cur : acc));

    if (selectionMode === 'auto') {
      if (!selectedAgentId || !exists) {
        setSelectedAgentId(best.agent_id);
      }
      return;
    }

    // Manual mode: if user explicitly cleared the selection, keep it cleared.
    if (selectedAgentId && !exists) {
      setSelectedAgentId(best.agent_id);
    }
  }, [live?.round_id, judgments, selectedAgentId, selectionMode]);

  const selected = useMemo(() => {
    if (!selectedAgentId) return null;
    return judgments.find((j) => j.agent_id === selectedAgentId) ?? null;
  }, [judgments, selectedAgentId]);

  // When selected view changes (user click or auto-pick), switch to a recommended interval.
  useEffect(() => {
    if (!selected) {
      setSelectedInterval('15m');
      return;
    }

    const start = selected.analysis_start_time ? Date.parse(selected.analysis_start_time) : NaN;
    const end = selected.analysis_end_time ? Date.parse(selected.analysis_end_time) : NaN;
    const rangeMs =
      Number.isFinite(start) && Number.isFinite(end) && start < end ? end - start : 24 * 60 * 60 * 1000;

    const next = pickBestIntervalForRange(selected.intervals ?? null, rangeMs);
    setSelectedInterval(next);
  }, [selected?.agent_id]);

  const handleSelectAgentId = (id: string | null) => {
    setSelectionMode('manual');
    setSelectedAgentId(id);
  };

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
        <div className="dashboard-grid">
          <MarketPanel
            live={live}
            selected={selected}
            selectedInterval={selectedInterval}
            onIntervalChange={setSelectedInterval}
          />
          <ReasonsPanel
            judgments={judgments}
            selectedAgentId={selectedAgentId}
            onSelectAgentId={handleSelectAgentId}
          />
        </div>
        <AgentsList agents={summary?.agents ?? []} />
        <FeedList feed={summary?.feed ?? []} />
      </main>
    </div>
  );
}
