import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { TranslationsConfig } from '@/types'

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


export  { initI18n }
