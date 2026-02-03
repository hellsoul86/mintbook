import { useTranslation } from 'react-i18next';
import { getLocale } from '../i18n';
import { formatTime } from '../utils/format';
import { LanguageToggle } from './LanguageToggle';
import { Badge } from './ui/badge';

export type HeroHeaderProps = {
  isOnline: boolean;
  serverTime?: string | null;
  lastSync?: number | null;
  symbol?: string | null;
};

export function HeroHeader({ isOnline, serverTime, lastSync, symbol }: HeroHeaderProps) {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  return (
    <header className="hero">
      <div className="hero-left">
        <div className="hero-top">
          <Badge className="badge" variant="secondary">
            {t('hero.badge')}
          </Badge>
          <span className={`status-pill ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? t('status.live') : t('status.offline')}
          </span>
        </div>
        <h1>{t('hero.title')}</h1>
        <p className="subtitle">{t('hero.subtitle')}</p>
      </div>
      <div className="hero-right">
        <LanguageToggle />
        <div className="hero-metric">
          <span className="label">{t('hero.symbol')}</span>
          <span className="value">{symbol || 'BTCUSDT'}</span>
        </div>
        <div className="hero-metric">
          <span className="label">{t('hero.decisionTime')}</span>
          <span className="value">{formatTime(serverTime, locale)}</span>
        </div>
        <div className="hero-metric">
          <span className="label">{t('hero.lastArchived')}</span>
          <span className="value">{formatTime(lastSync, locale)}</span>
        </div>
      </div>
    </header>
  );
}
