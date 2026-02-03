import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { FlipCard, Verdict } from '../types';
import { Card } from './ui/card';
import { formatDelta } from '../utils/format';

export type VerdictCardProps = {
  lastVerdict: Verdict | null;
  highlight: FlipCard | null;
  impact: boolean;
};

export function VerdictCard({ lastVerdict, highlight, impact }: VerdictCardProps) {
  const { t } = useTranslation();
  let tag = t('verdict.tagPending');
  let agent = '--';
  let text: ReactNode = t('verdict.waiting');
  let deltaText = '--';
  let scoreText = '--';
  let statusClass = '';

  if (lastVerdict) {
    deltaText = formatDelta(lastVerdict.delta_pct);
    if (highlight) {
      const isFail = highlight.result === 'FAIL';
      tag = isFail ? t('verdict.tagFail') : t('verdict.tagWin');
      statusClass = isFail ? 'fail' : 'win';
      agent = `${isFail ? '❌' : '✅'} ${highlight.agent} ${
        isFail ? t('verdict.agentFail') : t('verdict.agentWin')
      }`;
      const confidenceLine = t('verdict.confidenceLine', { confidence: highlight.confidence });
      const resultLine = t('verdict.resultLine', { delta: deltaText });
      const scoreLine = isFail
        ? t('verdict.scoreLineFail', { score: highlight.score_change })
        : t('verdict.scoreLineWin', { score: highlight.score_change });
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
      scoreText = isFail
        ? t('verdict.scoreTextFail', { score: `${scoreSign}${highlight.score_change}` })
        : t('verdict.scoreTextWin', { score: `${scoreSign}${highlight.score_change}` });
    } else {
      tag = t('verdict.tagDone');
      agent = t('verdict.doneAgent');
      text = t('verdict.resultLine', { delta: deltaText });
    }
  }

  return (
    <section className="section verdict" id="verdict">
      <div className="section-head">
        <h2>{t('verdict.sectionTitle')}</h2>
        <span className="meta">{t('verdict.sectionMeta')}</span>
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
