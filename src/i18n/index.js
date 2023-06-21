import { createI18n } from 'vue-i18n';
import en from './en';
import de from './de';

const messages = {
  en,
  de,
};

// Create I18n instance
export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  silentTranslationWarn: true,
  warnHtmlInMessage: 'off',
  legacy: false,
});

export default messages;
