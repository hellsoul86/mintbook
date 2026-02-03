import type { ReactNode } from 'react';
import type { FlipCard, Verdict } from '../types';
import { Card } from './ui/card';
import { formatDelta } from '../utils/format';

export type VerdictCardProps = {
  lastVerdict: Verdict | null;
  highlight: FlipCard | null;
  impact: boolean;
};

export function VerdictCard({ lastVerdict, highlight, impact }: VerdictCardProps) {
  let tag = '裁决登记中';
  let agent = '--';
  let text: ReactNode = '等待首案裁决';
  let deltaText = '--';
  let scoreText = '--';
  let statusClass = '';

  if (lastVerdict) {
    deltaText = formatDelta(lastVerdict.delta_pct);
    if (highlight) {
      const isFail = highlight.result === 'FAIL';
      tag = isFail ? '处刑公告' : '裁决登记';
      statusClass = isFail ? 'fail' : 'win';
      agent = `${isFail ? '❌' : '✅'} ${highlight.agent} ${
        isFail ? '被当场否决' : '暂时免刑'
      }`;
      const confidenceLine = `自信度：${highlight.confidence}%`;
      const resultLine = `结果：${deltaText}`;
      const scoreLine = isFail
        ? `惩罚：${highlight.score_change}（高置信失败）`
        : `奖励：+${highlight.score_change}（高置信命中）`;
      text = (
        <>
          {confidenceLine}
          <br />
          {resultLine}
          <br />
          {scoreLine}
        </>
      );
      const scoreSign = highlight.score_change > 0 ? '+' : '';
      scoreText = `${isFail ? '惩罚' : '奖励'} ${scoreSign}${highlight.score_change} 分`;
    } else {
      tag = '裁决完成';
      agent = '🔔 裁决完成';
      text = `结果：${deltaText}`;
    }
  }

  return (
    <section className="section verdict" id="verdict">
      <div className="section-head">
        <h2>上一局处刑公告</h2>
        <span className="meta">公告已归档</span>
      </div>
      <Card className={`verdict-card ${statusClass} ${impact ? 'impact' : ''}`}>
        <div className="verdict-left">
          <span className="verdict-tag">{tag}</span>
          <span className="verdict-agent">{agent}</span>
          <span className="verdict-text">{text}</span>
        </div>
        <div className="verdict-right">
          <span className="verdict-delta">{deltaText}</span>
          <span className="verdict-score">{scoreText}</span>
        </div>
      </Card>
    </section>
  );
}
