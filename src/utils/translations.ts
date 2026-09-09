import i18n, { TOptions } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { TranslationsConfig } from '@/types'

// Translating outside React - in the stores, in the api and config utils. The useTranslation hook
// needs a component to run in, and react-i18next's getI18n() is undefined until initI18n has run.
// When i18 is not initialised, the key is returned
function t(key: string, options?: TOptions): string {
  return i18n.isInitialized ? i18n.t(key, options) : key
}

function initI18n (translations: TranslationsConfig, lang: string){

  if (!i18n.isInitialized) {
    i18n
      .use(initReactI18next) // Integrates with React
      .init({
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
  }
}


export  { initI18n, t }
