import initI18n from '@/i18n.ts'
import i18n from 'i18next'

async function createTranslations(config, languages: string[]) {

  const translations = await loadTranslations(config, languages)

  await initI18n({
    ['en']: { translation: translations['en'] },
    ['de']: { translation: translations['de'] }
  })
  i18n.changeLanguage(config.lang)
}

async function loadTranslations(config, languages: string[]) {
  const translations : {[key:string]: Translations} = {}
  for (const lang of languages) {
    const defaultTranslations = await import((`../../public/translations/${lang}.json`))
    translations[lang] = { ...defaultTranslations, ...config.translations?.[lang] }
  }

  return translations
}



export default { createTranslations }
