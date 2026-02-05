import { useTranslation } from 'react-i18next';
import type { ReasonStatsResponse } from '../types';
import { getLocale } from '../i18n';

type StatsPanelProps = {
  stats: ReasonStatsResponse | null;
  isLoading: boolean;
  error: string | null;
  updatedAt: number | null;
};

function formatAccuracy(value: number | null | undefined) {
  if (value === null || value === undefined) return '--';
  return `${(value * 100).toFixed(1)}%`;
}

function formatDelta(value: number | null | undefined) {
  if (value === null || value === undefined) return '--';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function StatsPanel({ stats, isLoading, error, updatedAt }: StatsPanelProps) {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  if (isLoading && !stats) {
    return (
      <section className="section" id="stats">
        <div className="section-head">
          <h2>{t('stats.sectionTitle')}</h2>
          <span className="meta">{t('stats.sectionMeta')}</span>
        </div>
        <div className="stats-empty">{t('stats.loading')}</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section" id="stats">
        <div className="section-head">
          <h2>{t('stats.sectionTitle')}</h2>
          <span className="meta">{t('stats.sectionMeta')}</span>
        </div>
        <div className="stats-empty">{t('stats.error', { message: error })}</div>
      </section>
    );
  }

  if (!stats || stats.total_evaluated === 0) {
    return (
      <section className="section" id="stats">
        <div className="section-head">
          <h2>{t('stats.sectionTitle')}</h2>
          <span className="meta">{t('stats.sectionMeta')}</span>
        </div>
        <div className="stats-empty">{t('stats.empty')}</div>
      </section>
    );
  }

  const updated = updatedAt
    ? t('stats.updated', {
        time: new Date(updatedAt).toLocaleTimeString(locale, { hour12: false }),
      })
    : '';

  return (
    <section className="section" id="stats">
      <div className="section-head">
        <h2>{t('stats.sectionTitle')}</h2>
        <span className="meta">
          {t('stats.sectionMeta')}
          {updated ? ` · ${updated}` : ''}
        </span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="label">{t('stats.accuracyAll')}</span>
          <span className="value">{formatAccuracy(stats.accuracy_all)}</span>
          <span className="sub">{t('stats.totalEvaluated')}: {stats.total_evaluated}</span>
        </div>
        <div className="stat-card">
          <span className="label">{t('stats.accuracyValid')}</span>
          <span className="value">{formatAccuracy(stats.accuracy_valid)}</span>
          <span className="sub">{t('stats.totalValid')}: {stats.total_valid}</span>
        </div>
        <div className="stat-card">
          <span className="label">{t('stats.avgDelta')}</span>
          <span className="value">{formatDelta(stats.avg_delta_pct)}</span>
        </div>
        <div className="stat-card">
          <span className="label">{t('stats.avgAbsDelta')}</span>
          <span className="value">{formatDelta(stats.avg_abs_delta_pct)}</span>
        </div>
      </div>

      <div className="stats-split">
        <div>
          <div className="stats-title">{t('stats.byTimeframe')}</div>
          <div className="stats-list">
            {stats.by_timeframe.length === 0 ? (
              <div className="stats-row">{t('stats.empty')}</div>
            ) : (
              stats.by_timeframe.map((row) => (
                <div key={row.timeframe} className="stats-row">
                  <span className="name">{row.timeframe}</span>
                  <span className="meta">
                    {formatAccuracy(row.accuracy_all)} · {row.total_evaluated}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          <div className="stats-title">{t('stats.byPattern')}</div>
          <div className="stats-list">
            {stats.by_pattern.length === 0 ? (
              <div className="stats-row">{t('stats.empty')}</div>
            ) : (
              stats.by_pattern.map((row) => (
                <div key={row.pattern} className="stats-row">
                  <span className="name">{row.pattern}</span>
                  <span className="meta">
                    {formatAccuracy(row.accuracy_all)} · {row.total_evaluated}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
