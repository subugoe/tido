/* eslint-disable @typescript-eslint/no-explicit-any */

import { defaultConfig } from '@/utils/config/default-config.ts'
import enTranslations from '../../../public/translations/en.json'
import deTranslations from '../../../public/translations/de.json'

type ValidationResult<T> = {
  result: T;
  errors: Record<string, string>;
};

function validateContainer(input: any): ValidationResult<Config['container']> {
  const errors: Record<string, string> = {}
  const result =
    typeof input === 'string'
      ? input
      : (() => {
        if (input !== undefined)
          errors['container'] = 'must be a string'
        return defaultConfig.container
      })()
  return { result, errors }
}

function validatePanels(input: any): ValidationResult<Config['panels']> {
  const errors: Record<string, string> = {}
  const result = Array.isArray(input) ? input : (() => {
    if (input !== undefined)
      errors['panels'] = 'must be an array'
    return defaultConfig.panels ?? []
  })()

  return { result, errors }
}

function validateShowNewCollectionButton(input: any): ValidationResult<Config['showNewCollectionButton']> {
  const errors: Record<string, string> = {}
  const result =
    typeof input === 'boolean'
      ? input
      : (() => {
        if (input !== undefined)
          errors['showNewCollectionButton'] = 'must be a boolean'
        return defaultConfig.showNewCollectionButton
      })()
  return { result, errors }
}


function validateTheme(input: any): ValidationResult<Config['theme']> {
  const errors: Record<string, string> = {}
  const result = {
    primaryColor:
      typeof input === 'object' && typeof input['primaryColor'] === 'string'
        ? input['primaryColor']
        : (() => {
          errors['theme.primaryColor'] = 'must be a valid hex color'
          return defaultConfig.theme?.primaryColor
        })()
  }
  return { result, errors }
}

function validateLang(input: any): ValidationResult<Config['lang']> {
  const errors: Record<string, string> = {}
  const result =
    typeof input === 'string'
      ? input
      : (() => {
        if (input !== undefined)
          errors['language'] = 'lang must be a string'
        return defaultConfig.lang
      })()
  return { result, errors }
}

async function validateTranslations(input: any): Promise<ValidationResult<Config['translations']>> {
  const errors: Record<string, string>  = { }
  const result: {[key: string]: Translation} =
      typeof input === 'object'
        ? input
        : (() => {
          if (input !== undefined)
            errors['translations'] = 'language needs to be an object'
          return defaultConfig.translations
        })()
  return { result, errors }
}

function mergeTranslations(defaultTranslations: Translation, userTranslations: Translation) {
  return { ...defaultTranslations, ...userTranslations }
}

function getLang(lang: string, translations: Translations, defaultLangs: string[]): string {
  console.log('lang', lang)
  if (Object.keys(translations).includes(lang) || defaultLangs.includes(lang) ) return lang
  return 'en'
}

export async  function mergeAndValidateConfig(
  userConfig: Partial<Config>,
): Promise<{ config: Config; errors: Record<string, string> }> {

  const container = validateContainer(userConfig.container)
  const panels = validatePanels(userConfig.panels)
  const showNewCollectionButton = validateShowNewCollectionButton(userConfig.showNewCollectionButton)
  const theme = validateTheme(userConfig.theme)
  const lang = validateLang(userConfig.lang)

  const translations = await validateTranslations(userConfig.translations, lang.result as string)

  const mergedTranslations: Record<string, Translation> = {}
  const defaultLangs = ['en', 'de']
  const language = getLang(lang.result, translations.result, defaultLangs)
  console.log('language', language)
  const defaultTranslations =  language === 'en' ? enTranslations : language === 'de' ? deTranslations : {}
  mergedTranslations[language] = mergeTranslations(defaultTranslations, translations.result?.[language])
  console.log('merged translations', mergedTranslations)


  const errors = {
    ...container.errors,
    ...panels.errors,
    ...showNewCollectionButton.errors,
    ...theme.errors,
    ...lang.errors,
    ...translations.errors,
  }

  const config: Config = {
    container: container.result,
    panels: panels.result,
    showNewCollectionButton: showNewCollectionButton.result,
    theme: theme.result,
    lang: lang.result,
    translations: translations.result,
  }

  return { config, errors }
}
