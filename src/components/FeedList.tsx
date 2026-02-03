import { useTranslation } from 'react-i18next';
import type { FlipCard } from '../types';
import { getLocale } from '../i18n';
import { localizeFlipCard } from '../utils/localize';
import { Badge } from './ui/badge';

export function FeedList({ feed }: { feed: FlipCard[] }) {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  return (
    <section className="section" id="feed">
      <div className="section-head">
        <h2>{t('feed.sectionTitle')}</h2>
        <span className="meta">{t('feed.sectionMeta')}</span>
      </div>
      <div className="feed-list">
        {!feed || feed.length === 0 ? (
          <div className="feed-card">{t('feed.empty')}</div>
        ) : (
          feed.map((rawItem, index) => {
            const item = localizeFlipCard(rawItem, i18n.language, t);
            const sign = item.score_change > 0 ? '+' : '';
            const time = item.timestamp
              ? new Date(item.timestamp).toLocaleTimeString(locale, { hour12: false })
              : '--:--:--';
            const scoreClass = item.score_change >= 0 ? 'positive' : 'negative';
            const showTag = item.result === 'FAIL' && item.confidence >= 80;

            return (
              <div
                key={`${item.round_id}-${index}`}
                className={`feed-card ${item.result === 'FAIL' ? 'fail' : 'win'}`}
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div>
                  <div className="title">
                    {item.title}{' '}
                    {showTag ? <Badge className="tag">{t('feed.highConfidence')}</Badge> : null}
                  </div>
                  <div className="meta">{item.text}</div>
                  <div className="feed-meta">
                    {t('feed.confidenceMeta', { confidence: item.confidence, time })}
                  </div>
                </div>
                <div className={`score ${scoreClass}`}>
                  {t('feed.score', { score: `${sign}${item.score_change}` })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
