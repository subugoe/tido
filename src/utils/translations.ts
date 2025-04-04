import { apiRequest } from '@/utils/api.ts'

async function getTranslations(filePath: string) {
  const translations = await apiRequest(filePath)
  return translations ?? {}
}


async function mergeTranslations(lang: string, translationsDirPath: string, configTranslations = {}) {
  let translations = {}
  const tidoTranslationsPath = `/translations/tido/${lang}.json`
  const tidoTranslations =  await getTranslations(tidoTranslationsPath)

  console.log('tido translations', tidoTranslations)

  translations = typeof tidoTranslations === 'object' ? tidoTranslations : {}

  const userTranslations = await getTranslations(`${translationsDirPath}/${lang}.json`)

  console.log('userTranslations', userTranslations)

  translations = typeof userTranslations === 'object' ? { ...translations, ...userTranslations } : translations

  translations = { ...translations, ...configTranslations }

  console.log('merged translations', translations)
}


export { mergeTranslations }
