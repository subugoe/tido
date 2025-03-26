import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend' // Import the HTTP backend

// Initialize i18next with options
i18n
  .use(initReactI18next) // Integrates with React
  .use(HttpBackend)
  .init({
    fallbackLng: 'en', // Default language if language detection fails
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    backend: {
      loadPath: `{{lng}}.json`, // Load translations from the /locales folder
    },
    react: {
      useSuspense: false, // Suspense support for loading translations
    },
  })

export default i18n
