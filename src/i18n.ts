import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

async function initI18n (translations: TranslationsI18n) {
  if (!i18n.isInitialized) {
    console.log('translations', translations)
    i18n
      .use(initReactI18next) // Integrates with React
      .init({
        resources: translations,
        lng: 'en',
        fallbackLng: 'en', // Default language if language detection fails
        interpolation: {
          escapeValue: false, // React already does escaping
        },
        react: {
          useSuspense: true, // Suspense support for loading translations
        },
      })
  }
}


export default initI18n
