import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

async function initI18n (translations: Translations) {
  console.log('translations ', translations)
  if (!i18n.isInitialized) {
    i18n
      .use(initReactI18next) // Integrates with React
      .init({
        resources: translations,
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
