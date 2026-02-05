import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Judgment, LiveRound } from '../types';
import { getLocale } from '../i18n';
import { formatPrice } from '../utils/format';
import { intervalToMs, SUPPORTED_INTERVALS } from '../utils/intervals';
import { formatRange } from '../utils/time';
import { useKlines } from '../hooks/useKlines';
import { KlineChart } from './KlineChart';

export type MarketPanelProps = {
  live: LiveRound | null;
  selected: Judgment | null;
  selectedInterval: string;
  onIntervalChange: (interval: string) => void;
};

function parseIsoMs(value: string | null | undefined): number | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function MarketPanel({ live, selected, selectedInterval, onIntervalChange }: MarketPanelProps) {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);
  const chartLimit = 200;

  const symbol = live?.symbol ?? 'BTCUSDT';

  const range = useMemo(() => {
    const start = parseIsoMs(selected?.analysis_start_time);
    const end = parseIsoMs(selected?.analysis_end_time);
    if (start !== null && end !== null && start < end) {
      return { startMs: start, endMs: end, source: 'analysis' as const };
    }
    const endMs = Date.now();
    const startMs = endMs - 24 * 60 * 60 * 1000;
    return { startMs, endMs, source: 'default' as const };
  }, [selected?.analysis_start_time, selected?.analysis_end_time]);

  const intervalMs = intervalToMs(selectedInterval);
  const alignedEndMs = Math.floor(range.endMs / intervalMs) * intervalMs;
  const chartRange = {
    endMs: alignedEndMs,
    startMs: alignedEndMs - intervalMs * chartLimit,
  };
  const chartRangeText = formatRange(
    new Date(chartRange.startMs).toISOString(),
    new Date(chartRange.endMs).toISOString(),
    locale
  );

  const klines = useKlines({
    symbol,
    interval: selectedInterval,
    startTimeMs: chartRange.startMs,
    endTimeMs: chartRange.endMs,
    limit: chartLimit,
    refreshMs: 15_000,
  });

  const selectedName = selected ? selected.agent_name || selected.agent_id : null;
  const selectedDirection = selected?.direction?.toUpperCase?.() ?? null;
  const directionClass =
    selectedDirection === 'UP' ? 'up' : selectedDirection === 'DOWN' ? 'down' : 'flat';

  const intervals = selected?.intervals ?? [];

  return (
    <section className="section" id="market">
      <div className="section-head">
        <h2>{t('market.sectionTitle')}</h2>
        <span className="meta">{t('market.sectionMeta')}</span>
      </div>

      <div className="market-top">
        <div className="market-symbol">
          <div className="label">{t('market.symbolLabel')}</div>
          <div className="value">{symbol}</div>
        </div>
        <div className="market-price">
          <div className="label">{t('market.priceLabel')}</div>
          <div className="value">{formatPrice(live?.current_price ?? null, locale)}</div>
        </div>
        <div className="market-updated">
          <div className="label">{t('market.updatedLabel')}</div>
          <div className="value">{klines.updatedAt ? new Date(klines.updatedAt).toLocaleTimeString(locale, { hour12: false }) : '--'}</div>
        </div>
      </div>

      <div className="interval-picker" role="tablist" aria-label={t('market.intervalLabel')}
      >
        {SUPPORTED_INTERVALS.map((interval) => {
          const active = interval === selectedInterval;
          return (
            <button
              key={interval}
              type="button"
              className={`interval-btn ${active ? 'active' : ''}`}
              onClick={() => onIntervalChange(interval)}
            >
              {interval}
            </button>
          );
        })}
      </div>

      <div className="market-chart">
        {klines.isLoading && (!klines.data || klines.data.length === 0) ? (
          <div className="chart-empty">{t('market.loading')}</div>
        ) : klines.error ? (
          <div className="chart-empty">{t('market.error', { message: klines.error })}</div>
        ) : !klines.data || klines.data.length === 0 ? (
          <div className="chart-empty">{t('market.noData')}</div>
        ) : (
          <KlineChart candles={klines.data} locale={locale} />
        )}
      </div>

      <div className="market-foot">
        <div className="market-foot-row">
          <div className="label">{t('market.selectedLabel')}</div>
          <div className="value">
            {selected ? (
              <span className={`dir-pill ${directionClass}`}>
                {selectedName || '--'} · {t('direction.' + directionClass)} · {selected.confidence}%
              </span>
            ) : (
              <span className="muted">{t('market.defaultView')}</span>
            )}
          </div>
        </div>

        <div className="market-foot-row">
          <div className="label">{t('market.rangeLabel')}</div>
          <div className="value">
            {selected && range.source === 'analysis'
              ? formatRange(selected.analysis_start_time, selected.analysis_end_time, locale)
              : t('market.defaultRange')}
          </div>
        </div>

        <div className="market-foot-row">
          <div className="label">{t('market.chartRangeLabel')}</div>
          <div className="value">{chartRangeText}</div>
        </div>

        <div className="market-foot-row">
          <div className="label">{t('market.limitLabel')}</div>
          <div className="value">
            {t('market.limitValue', { limit: chartLimit })}{' '}
            <span className="muted">{t('market.truncateHint')}</span>
          </div>
        </div>

        {intervals.length > 0 ? (
          <div className="market-foot-row">
            <div className="label">{t('market.usedIntervalsLabel')}</div>
            <div className="value tags">
              {intervals.map((interval) => (
                <span key={interval} className="tag interval">
                  {interval}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
