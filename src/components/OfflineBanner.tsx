import { useTranslation } from 'react-i18next';

export function OfflineBanner({ show }: { show: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="offline-banner" style={{ display: show ? 'flex' : 'none' }}>
      {t('offline.banner')}
    </div>
  );
}
