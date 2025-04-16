/* eslint-disable @typescript-eslint/no-explicit-any */

import { defaultConfig } from '@/utils/config/default-config.ts'

import enTranslations from '../../../public/translations/en.json'
import deTranslations from '../../../public/translations/de.json'

type ValidationResult<T> = {
  result: T;
  errors: Record<string, string>;
};

function validateContainer(input: any): ValidationResult<AppConfig['container']> {
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

function validateDefaultView(input: any): ValidationResult<AppConfig['defaultView']> {
  const errors: Record<string, string> = {}
  const result =
    typeof input === 'string' && ['pip', 'split', 'text', 'image'].includes(input)
      ? input as ViewType
      : (() => {
        if (input !== undefined)
          errors['defaultView'] = 'defaultView must be a string'
        return defaultConfig.defaultView
      })()
  return { result, errors }
}

function validateGlobalTree(input: any): ValidationResult<AppConfig['showGlobalTree']> {
  const errors: Record<string, string> = {}
  const result =
      typeof input === 'boolean'
        ? input
        : (() => {
          if (input !== undefined)
            errors['showGlobalTree'] = 'must be a boolean'
          return defaultConfig.showGlobalTree
        })()
  return { result, errors }
}

function validatePanels(input: any): ValidationResult<AppConfig['panels']> {
  const errors: Record<string, string> = {}
  const result = Array.isArray(input) ? input : (() => {
    if (input !== undefined)
      errors['panels'] = 'must be an array'
    return defaultConfig.panels ?? []
  })()

  return { result, errors }
}

function validateShowNewCollectionButton(input: any): ValidationResult<AppConfig['showNewCollectionButton']> {
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

function validateTheme(input: any): ValidationResult<AppConfig['theme']> {
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

function validateLang(input: any): ValidationResult<AppConfig['lang']> {
  const errors: Record<string, string> = {}
  const result =
      typeof input === 'string'
        ? input
        : (() => {
          if (input !== undefined)
            errors['lang'] = 'lang must be a string'
          return defaultConfig.lang
        })()
  return { result, errors }
}

function validateTranslations(input: any): ValidationResult<AppConfig['translations']> {
  const errors: Record<string, string>  = { }
  const result =
      typeof input === 'object'
        ? input
        : (() => {
          if (input !== undefined)
            errors['translations'] = 'translations needs to be an object'
          return defaultConfig.translations
        })()
  return { result, errors }
}


function getLanguage(lang: string, translations: Translations, defaultLangs: string[]): string {
  if (Object.keys(translations).includes(lang) || defaultLangs.includes(lang)) return lang
  return 'en'
}

export function mergeAndValidateConfig(
  userConfig: Partial<AppConfig>,
): { config: AppConfig; errors: Record<string, string> } {

  const container = validateContainer(userConfig.container)
  const defaultView = validateDefaultView(userConfig.defaultView)
  const panels = validatePanels(userConfig.panels)
  const showGlobalTree = validateGlobalTree(userConfig.showGlobalTree)
  const showNewCollectionButton = validateShowNewCollectionButton(userConfig.showNewCollectionButton)
  const theme = validateTheme(userConfig.theme)
  const lang = validateLang(userConfig.lang)
  const translations = validateTranslations(userConfig.translations)

  const mergedTranslations: Record<string, Translation> = {}
  const defaultLangs = ['en', 'de']
  const language = getLanguage(lang.result, translations.result, defaultLangs)
  const defaultTranslations =  language === 'en' ? enTranslations : language === 'de' ? deTranslations : {}
  mergedTranslations[language] = { ...defaultTranslations, ...translations.result?.[language] }


  const errors = {
    ...container.errors,
    ...defaultView.errors,
    ...panels.errors,
    ...showGlobalTree.errors,
    ...showNewCollectionButton.errors,
    ...theme.errors,
    ...lang.errors,
    ...translations.errors,
  }

  const config: AppConfig = {
    container: container.result,
    panels: panels.result,
    defaultView: defaultView.result,
    showGlobalTree: showGlobalTree.result,
    showNewCollectionButton: showNewCollectionButton.result,
    theme: theme.result,
    lang: lang.result,
    translations: mergedTranslations,
  }

  return { config, errors }
}
