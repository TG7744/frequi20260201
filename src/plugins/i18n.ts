import { createI18n } from 'vue-i18n';

import en from '@/locales/en';
import zh from '@/locales/zh';

let defaultLocale = 'en';
if (typeof window !== 'undefined') {
  const persisted = window.localStorage.getItem('ftUISettings');
  if (persisted) {
    try {
      const parsed = JSON.parse(persisted);
      defaultLocale = parsed.locale || defaultLocale;
    } catch (error) {
      //
    }
  } else if (typeof navigator !== 'undefined' && navigator.language.startsWith('zh')) {
    defaultLocale = 'zh';
  }
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    zh,
  },
});

export default i18n;
