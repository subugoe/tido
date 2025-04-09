/* eslint-disable @typescript-eslint/no-explicit-any */

import { defaultConfig } from '@/utils/config/default-config.ts'

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

function validateLang(input: any, translations: any): ValidationResult<Config['lang']> {
  const errors: Record<string, string> = {}
  const result =
    typeof input === 'string' && typeof translations === 'object' && Object.keys(translations).includes(input)
      ? input
      : (() => {
        if (input !== undefined)
          errors['language'] = 'must be a string'
        return defaultConfig.lang
      })()
  return { result, errors }
}

async function validateTranslations(input: any, lang: string): Promise<ValidationResult<Config['translations']>> {
  const errors: Record<string, string>  = { }
  let result: {[key: string]: Translation} = {}
  try {
    const defaultTranslations = await import((`../../../public/translations/${lang}.json`))
    result = { [lang]: defaultTranslations.default ?? {} }
  } catch (error) {
    errors['translations'] = {}
    errors['translations']['translation_file'] = 'Please provide a valid `lang` value for which there is a TIDO translation file'
    const enDefaultTranslations = await import((`../../../public/translations/en.json`))
    result = { ['en']: enDefaultTranslations.default }
  }


  if (typeof input === 'undefined') {
    return { result, errors }
  }

  if (typeof input === 'object' && Object.keys(input).includes(lang)) {
    result[lang] = { ...result[lang], ...input[lang] }
    return { result, errors }
  }

  return { result, errors }
}



export async  function mergeAndValidateConfig(
  userConfig: Partial<Config>,
): Promise<{ config: Config; errors: Record<string, string> }> {

  const container = validateContainer(userConfig.container)
  const panels = validatePanels(userConfig.panels)
  const showNewCollectionButton = validateShowNewCollectionButton(userConfig.showNewCollectionButton)
  const theme = validateTheme(userConfig.theme)
  const lang = validateLang(userConfig.lang, userConfig.translations)
  const translations = await validateTranslations(userConfig.translations, lang.result)

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
