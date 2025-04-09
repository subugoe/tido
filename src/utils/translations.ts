import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

async function initI18n (translations) {
  if (!i18n.isInitialized) {
    i18n
      .use(initReactI18next) // Integrates with React
      .init({
        resources: translations,
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

async function createTranslations( config, languages: string[]) {

  const translations = await loadTranslations( config, languages)

  await initI18n({
    ['en']: { translation: translations['en'] },
    ['de']: { translation: translations['de'] }
  })
  i18n.changeLanguage(config.lang)
}

async function loadTranslations( config, languages: string[]) {
  const translations : {[key:string]: Translations} = {}
  for (const lang of languages) {
    const defaultTranslations = await import((`../../public/translations/${lang}.json`))
    translations[lang] = { ...defaultTranslations.default, ...config.translations?.[lang] }
  }

  return translations
}


export  { initI18n, createTranslations }
