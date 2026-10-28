import i18next, { i18n as I18n } from 'i18next'
import { TranslationsConfig } from '@/types'

// A new instance for each config, so that the translations and the language of a previous config
// do not leak into the next one. It is bound to its TIDO instance through the I18nextProvider.
function createI18n(translations: TranslationsConfig, lang: string): I18n {
  const instance = i18next.createInstance()

  // With inline resources, init runs synchronously - the instance is ready once this returns
  instance.init({
    resources: translations,
    keySeparator: false,
    lng: lang,
    fallbackLng: 'en', // Default language if language detection fails
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    defaultNS: 'common',
    fallbackNS: 'common',
    react: {
      useSuspense: true, // Suspense support for loading translations
    },
  })

  return instance
}


export  { createI18n }
