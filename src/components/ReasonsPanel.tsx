import { useTranslation } from 'react-i18next';
import type { Judgment } from '../types';
import { getLocale } from '../i18n';
import { formatRange } from '../utils/time';

export function ReasonsPanel({
  judgments,
  selectedAgentId,
  onSelectAgentId,
}: {
  judgments: Judgment[];
  selectedAgentId: string | null;
  onSelectAgentId: (id: string | null) => void;
}) {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  const grouped = {
    bull: [] as Judgment[],
    bear: [] as Judgment[],
    neutral: [] as Judgment[],
  };

  (judgments || []).forEach((item) => {
    const direction = item.direction?.toUpperCase();
    if (direction === 'UP') {
      grouped.bull.push(item);
    } else if (direction === 'DOWN') {
      grouped.bear.push(item);
    } else {
      grouped.neutral.push(item);
    }
  });

  const sortByConfidence = (items: Judgment[]) =>
    [...items].sort((a, b) => (b.confidence || 0) - (a.confidence || 0));

  const renderItems = (items: Judgment[], emptyKey: string) => {
    if (!items || items.length === 0) {
      return (
        <div className="reason-item">
          <div className="text">{t(emptyKey)}</div>
        </div>
      );
    }

    return sortByConfidence(items).map((item) => {
      const comment = item.comment?.trim() || t('reasons.missing');
      const agentName = item.agent_name || item.agent_id || '--';
      const meta = `${agentName} · ${t('reasons.confidenceMeta', {
        confidence: item.confidence,
      })}`;

      const isSelected = !!selectedAgentId && selectedAgentId === item.agent_id;
      const rangeText = formatRange(item.analysis_start_time, item.analysis_end_time, locale);
      const intervals = item.intervals || [];

      return (
        <button
          key={`${item.round_id}-${item.agent_id}-${item.timestamp}`}
          type="button"
          className={`reason-item selectable ${isSelected ? 'selected' : ''}`}
          onClick={() => onSelectAgentId(isSelected ? null : item.agent_id)}
        >
          <div className="text">{comment}</div>
          <div className="meta">{meta}</div>
          <div className="reason-meta-row">
            <span className="meta">
              {t('reasons.rangeLabel')}: {rangeText}
            </span>
          </div>
          {intervals.length > 0 ? (
            <div className="reason-tags">
              {intervals.map((interval) => (
                <span key={interval} className="tag interval">
                  {interval}
                </span>
              ))}
            </div>
          ) : null}
        </button>
      );
    });
  };

  return (
    <section className="section" id="reasons">
      <div className="section-head">
        <h2>{t('reasons.sectionTitle')}</h2>
        <span className="meta">{t('reasons.sectionMeta')}</span>
      </div>
      <div className="reasons-grid">
        <div className="reason-column bull">
          <div className="reason-title">{t('reasons.bullTitle')}</div>
          {renderItems(grouped.bull, 'reasons.emptyBull')}
        </div>
        <div className="reason-column bear">
          <div className="reason-title">{t('reasons.bearTitle')}</div>
          {renderItems(grouped.bear, 'reasons.emptyBear')}
        </div>
        {grouped.neutral.length > 0 ? (
          <div className="reason-column neutral">
            <div className="reason-title">{t('reasons.neutralTitle')}</div>
            {renderItems(grouped.neutral, 'reasons.emptyNeutral')}
          </div>
        ) : null}
      </div>
    </section>
  );
}
