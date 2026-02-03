import { useTranslation } from 'react-i18next';
import { setLanguage } from '../i18n';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className={`lang-btn ${!isZh ? 'active' : ''}`}
        aria-pressed={!isZh}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
      <button
        type="button"
        className={`lang-btn ${isZh ? 'active' : ''}`}
        aria-pressed={isZh}
        onClick={() => setLanguage('zh')}
      >
        中文
      </button>
    </div>
  );
}
