import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { zh } from './locales/zh';

const STORAGE_KEY = 'mintbook_lang';

type SupportedLang = 'en' | 'zh';

const saved = (typeof window !== 'undefined' && window.localStorage)
  ? window.localStorage.getItem(STORAGE_KEY)
  : null;

const initialLang: SupportedLang = saved === 'zh' || saved === 'en' ? saved : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
  },
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export function setLanguage(lang: SupportedLang) {
  i18n.changeLanguage(lang);
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(STORAGE_KEY, lang);
  }
}

export function getLocale(lang: string) {
  return lang.startsWith('zh') ? 'zh-CN' : 'en-US';
}

export default i18n;
