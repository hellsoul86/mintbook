import { useTranslation } from 'react-i18next';
import type { LiveRound } from '../types';
import { getLocale } from '../i18n';
import { formatDelta, formatPrice } from '../utils/format';
import { statusLabel } from '../utils/labels';
import { JudgmentRow } from './JudgmentRow';

export type LivePanelProps = {
  live: LiveRound | null;
  countdown: string;
};

export function LivePanel({ live, countdown }: LivePanelProps) {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  if (!live) {
    return (
      <section className="section" id="live">
        <div className="section-head">
          <h2>{t('live.sectionTitle')}</h2>
          <span className="meta">{t('live.caseId', { id: '--' })}</span>
        </div>

        <div className="live-grid">
          <div className="tile timer">
            <span className="label">{t('live.timerLabel')}</span>
            <span className="value">--:--</span>
            <span className="hint">{t('live.timerHint')}</span>
          </div>
          <div className="tile price">
            <span className="label">{t('live.priceLabel')}</span>
            <span className="value">--</span>
            <span className="hint">{t('live.priceHint', { price: '--' })}</span>
          </div>
          <div className="tile status">
            <span className="label">{t('live.statusLabel')}</span>
            <span className="value">--</span>
            <span className="hint">{t('live.statusHint', { minutes: 30 })}</span>
          </div>
          <div className="tile swing">
            <span className="label">{t('live.swingLabel')}</span>
            <span className="value">--</span>
            <span className="hint">{t('live.swingHint')}</span>
          </div>
        </div>

        <JudgmentRow judgments={[]} />
      </section>
    );
  }

  const delta =
    typeof live.current_price === 'number' && typeof live.start_price === 'number'
      ? ((live.current_price - live.start_price) / live.start_price) * 100
      : null;
  const isPositive = typeof delta === 'number' && delta > 0;
  const isNegative = typeof delta === 'number' && delta < 0;

  return (
    <section className="section" id="live">
      <div className="section-head">
        <h2>{t('live.sectionTitle')}</h2>
        <span className="meta">{t('live.caseId', { id: live.round_id })}</span>
      </div>

      <div className="live-grid">
        <div className="tile timer">
          <span className="label">{t('live.timerLabel')}</span>
          <span className="value">{countdown}</span>
          <span className="hint">{t('live.timerHint')}</span>
        </div>
        <div className="tile price">
          <span className="label">{t('live.priceLabel')}</span>
          <span className="value">{formatPrice(live.current_price, locale)}</span>
          <span className="hint">
            {t('live.priceHint', { price: formatPrice(live.start_price, locale) })}
          </span>
        </div>
        <div className="tile status">
          <span className="label">{t('live.statusLabel')}</span>
          <span className="value">{statusLabel(live.status, t)}</span>
          <span className="hint">{t('live.statusHint', { minutes: live.duration_min })}</span>
        </div>
        <div className="tile swing">
          <span className="label">{t('live.swingLabel')}</span>
          <span className={`value ${isPositive ? 'positive' : ''} ${isNegative ? 'negative' : ''}`}>
            {delta === null ? '--' : t('live.swingValue', { delta: formatDelta(delta, 2) })}
          </span>
          <span className="hint">{delta === null ? t('live.swingHint') : ''}</span>
        </div>
      </div>

      <JudgmentRow judgments={live.judgments} />
    </section>
  );
}
