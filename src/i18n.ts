import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend' // Import the HTTP backend

// Initialize i18next with options
// get the path of translation and the language

const initI18n = (customPath = '') => {
  if (!i18n.isInitialized) {
    i18n
      .use(initReactI18next) // Integrates with React
      .use(HttpBackend)
      .init({
        fallbackLng: 'en', // Default language if language detection fails
        interpolation: {
          escapeValue: false, // React already does escaping
        },
        backend: {
          loadPath: `${customPath}/{{lng}}.json`, // Load translations from the /locales folder
        },
        react: {
          useSuspense: true, // Suspense support for loading translations
        },
      })
  }
}


export default initI18n
