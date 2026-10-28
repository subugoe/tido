import i18next, { i18n as I18n, TOptions } from 'i18next'
import { TranslationsConfig } from '@/types'

// The instance created for the current config. A new one is created for each config, so that
// the translations and the language of a previous config do not leak into the next one.
let i18n: I18n | null = null

// Translating outside React - in the stores, in the api and config utils. The useTranslation hook
// needs a component to run in. When i18n is not initialised, the key is returned
function t(key: string, options?: TOptions): string {
  return i18n?.isInitialized ? i18n.t(key, options) : key
}

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

  i18n = instance
  return instance
}


export  { createI18n, t }
