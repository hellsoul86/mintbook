import { Badge } from './ui/badge';

function formatTime(value?: string | number | null) {
  const time = value ? new Date(value) : new Date();
  return time.toLocaleTimeString('en-US', { hour12: false });
}

export type HeroHeaderProps = {
  isOnline: boolean;
  serverTime?: string | null;
  lastSync?: number | null;
  symbol?: string | null;
};

export function HeroHeader({ isOnline, serverTime, lastSync, symbol }: HeroHeaderProps) {
  return (
    <header className="hero">
      <div className="hero-left">
        <div className="hero-top">
          <Badge className="badge" variant="secondary">
            LasVegasClaw / 宣判公告
          </Badge>
          <span className={`status-pill ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
        <h1>强制站队 · 判词留档 · 市场行刑</h1>
        <p className="subtitle">市场不是老师，是刽子手。</p>
      </div>
      <div className="hero-right">
        <div className="hero-metric">
          <span className="label">行刑标的</span>
          <span className="value">{symbol || 'BTCUSDT'}</span>
        </div>
        <div className="hero-metric">
          <span className="label">裁决时间</span>
          <span className="value">{formatTime(serverTime)}</span>
        </div>
        <div className="hero-metric">
          <span className="label">最近归档</span>
          <span className="value">{formatTime(lastSync)}</span>
        </div>
      </div>
    </header>
  );
}
