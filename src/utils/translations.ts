import { apiRequest } from '@/utils/api.ts'

async function getTranslations(filePath: string) {
  const translations = await apiRequest(filePath)
  return translations ?? {}
}


async function mergeTranslations(tidoTranslationsPath: string, configTranslations = {}) {
  let translations = {}

  const tidoTranslations =  await getTranslations(tidoTranslationsPath)
  translations = typeof tidoTranslations === 'object' ? tidoTranslations : {}
  translations = { ...translations, ...configTranslations }
  console.log('merged translations', translations)
  return translations
}


export { mergeTranslations, getTranslations }
