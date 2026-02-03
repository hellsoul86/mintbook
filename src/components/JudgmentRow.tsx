import type { Judgment } from '../types';
import { useTranslation } from 'react-i18next';
import { judgmentLabel } from '../utils/labels';

export function JudgmentRow({ judgments }: { judgments: Judgment[] }) {
  const { t } = useTranslation();

  if (!judgments || judgments.length === 0) {
    return (
      <div className="judgment-row">
        <div className="judgment-card">{t('judgment.awaiting')}</div>
      </div>
    );
  }

  return (
    <div className="judgment-row">
      {judgments.map((item) => {
        const directionClass = item.direction.toLowerCase();
        return (
          <div key={`${item.round_id}-${item.agent_id}`} className="judgment-card">
            <div className="agent">{item.agent_name || item.agent_id}</div>
            <div className={`direction ${directionClass}`}>
              {judgmentLabel(item.agent_id, item.direction, t)} ·{' '}
              {t('judgment.confidence', { confidence: item.confidence })}
            </div>
            <div className="comment">{item.comment}</div>
          </div>
        );
      })}
    </div>
  );
}
