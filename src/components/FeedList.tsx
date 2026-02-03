import type { FlipCard } from '../types';
import { Badge } from './ui/badge';

export function FeedList({ feed }: { feed: FlipCard[] }) {
  return (
    <section className="section" id="feed">
      <div className="section-head">
        <h2>处刑记录</h2>
        <span className="meta">默认只展示高置信失败</span>
      </div>
      <div className="feed-list">
        {!feed || feed.length === 0 ? (
          <div className="feed-card">暂无处刑记录</div>
        ) : (
          feed.map((item, index) => {
            const sign = item.score_change > 0 ? '+' : '';
            const time = item.timestamp
              ? new Date(item.timestamp).toLocaleTimeString('en-US', { hour12: false })
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
                    {item.title} {showTag ? <Badge className="tag">高置信</Badge> : null}
                  </div>
                  <div className="meta">{item.text}</div>
                  <div className="feed-meta">
                    {item.confidence}% · {time}
                  </div>
                </div>
                <div className={`score ${scoreClass}`}>{sign}{item.score_change} 分</div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
