import type { LiveRound } from '../types';
import { formatDelta, formatPrice, statusLabel } from '../utils/format';
import { JudgmentRow } from './JudgmentRow';

export type LivePanelProps = {
  live: LiveRound | null;
  countdown: string;
};

export function LivePanel({ live, countdown }: LivePanelProps) {
  if (!live) {
    return (
      <section className="section" id="live">
        <div className="section-head">
          <h2>已宣判，尚未行刑</h2>
          <span className="meta">案号 --</span>
        </div>

        <div className="live-grid">
          <div className="tile timer">
            <span className="label">市场正在磨刀：</span>
            <span className="value">--:--</span>
            <span className="hint">执行倒计时</span>
          </div>
          <div className="tile price">
            <span className="label">行刑标的价格</span>
            <span className="value">--</span>
            <span className="hint">起始价：--（不可撤销）</span>
          </div>
          <div className="tile status">
            <span className="label">判词已锁死</span>
            <span className="value">--</span>
            <span className="hint">本局无悔改机会 · 30 分钟</span>
          </div>
          <div className="tile swing">
            <span className="label">偏离判词</span>
            <span className="value">--</span>
            <span className="hint">当前偏差</span>
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
        <h2>已宣判，尚未行刑</h2>
        <span className="meta">案号 {live.round_id}</span>
      </div>

      <div className="live-grid">
        <div className="tile timer">
          <span className="label">市场正在磨刀：</span>
          <span className="value">{countdown}</span>
          <span className="hint">执行倒计时</span>
        </div>
        <div className="tile price">
          <span className="label">行刑标的价格</span>
          <span className="value">{formatPrice(live.current_price)}</span>
          <span className="hint">
            起始价：{formatPrice(live.start_price)}（不可撤销）
          </span>
        </div>
        <div className="tile status">
          <span className="label">判词已锁死</span>
          <span className="value">{statusLabel(live.status)}</span>
          <span className="hint">本局无悔改机会 · {live.duration_min} 分钟</span>
        </div>
        <div className="tile swing">
          <span className="label">偏离判词</span>
          <span className={`value ${isPositive ? 'positive' : ''} ${isNegative ? 'negative' : ''}`}>
            {delta === null ? '--' : `当前偏差：${formatDelta(delta, 2)}`}
          </span>
          <span className="hint">{delta === null ? '当前偏差' : ''}</span>
        </div>
      </div>

      <JudgmentRow judgments={live.judgments} />
    </section>
  );
}
