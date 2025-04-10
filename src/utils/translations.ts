import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

function convertTranslations(translations: Translations) {
  // translations are converted to expected 3 level format: lang, 'translation', key values translation object
  // i.e {
  //      'en': {
  //          'translation': {'sync_panels': 'Sync Panels'}, {'new': 'New'}
  //        }
  //     }
  return Object.fromEntries(
    Object.entries(translations).map(([lang, values]) => [
      lang,
      { translation: values },
    ])
  )
}

function initI18n (translations: Translations){
  if (!i18n.isInitialized) {
    const resources = convertTranslations(translations)

    i18n
      .use(initReactI18next) // Integrates with React
      .init({
        resources: resources,
        keySeparator: false,
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


export  { initI18n }
