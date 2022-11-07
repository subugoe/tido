import { createI18n } from 'vue-i18n';
import messages from 'src/i18n';

// Create I18n instance
const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  silentTranslationWarn: true,
  warnHtmlInMessage: 'off',
});

export default ({ app }) => {
  // Tell app to use the I18n instance
  app.use(i18n);
};

export { i18n };
