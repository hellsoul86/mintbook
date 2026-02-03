import type { Judgment } from '../types';
import { judgmentLabel } from '../utils/format';

export function JudgmentRow({ judgments }: { judgments: Judgment[] }) {
  if (!judgments || judgments.length === 0) {
    return (
      <div className="judgment-row">
        <div className="judgment-card">等待宣判...</div>
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
              {judgmentLabel(item.agent_id, item.direction)} · {item.confidence}% 自信
            </div>
            <div className="comment">{item.comment}</div>
          </div>
        );
      })}
    </div>
  );
}
