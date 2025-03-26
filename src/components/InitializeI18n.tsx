import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import { FC, useEffect } from 'react' // Import the HTTP backend

interface I18nProps {
  translationsDirPath: string,
  language?: string
}

const InitializeI18n: FC <I18nProps>= ({ translationsDirPath, language }) => {
  // prop: a list of language codes
// Initialize i18next with options

  useEffect(() => {

    i18n
      .use(initReactI18next) // Integrates with React
      .use(HttpBackend)
      .init({
        fallbackLng: 'en', // Default language if language detection fails
        interpolation: {
          escapeValue: false, // React already does escaping
        },
        backend: {
          loadPath: `${translationsDirPath}/{{lng}}.json` // Load translations from the /locales folder
        },
        react: {
          useSuspense: false, // Suspense support for loading translations
        },
      })

    i18n.changeLanguage(language ?? 'en')
  }, [])

  return (
    <div className="">
    </div>
  )
}

export default InitializeI18n
