/* eslint-disable @typescript-eslint/no-explicit-any */

import { defaultConfig } from '@/utils/config/default-config.ts'

import enTranslations from '../../../public/translations/en.json'
import deTranslations from '../../../public/translations/de.json'

type ValidationResult<T> = {
  result: T;
  errors: Record<string, string>;
};

function validateAllowNewCollections(input: any): ValidationResult<AppConfig['allowNewCollections']> {
  const errors: Record<string, string> = {}
  const result =
    typeof input === 'boolean'
      ? input
      : (() => {
        if (input !== undefined)
          errors['allowNewCollections'] = 'must be a boolean'
        return defaultConfig.allowNewCollections
      })()
  return { result, errors }
}

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

function validateShowNewCollectionButton(input: any): ValidationResult<AppConfig['showAddNewPanelButton']> {
  const errors: Record<string, string> = {}
  const result =
    typeof input === 'boolean'
      ? input
      : (() => {
        if (input !== undefined)
          errors['showAddNewPanelButton'] = 'must be a boolean'
        return defaultConfig.showAddNewPanelButton
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

function validateTitle(input: any): ValidationResult<AppConfig['title']> {
  const errors: Record<string, string> = {}
  const result =
    typeof input === 'string'
      ? input
      : (() => {
        if (input !== undefined)
          errors['title'] = 'title must be a string'
        return defaultConfig.title
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

function validateRootCollections(input: any): ValidationResult<AppConfig['rootCollections']> {
  const errors: Record<string, string> = {}
  const result =
    Array.isArray(input)
      ? input
      : (() => {
        if (input !== undefined)
          errors['root Collections'] = 'root Collections needs to be an array'
        return defaultConfig.rootCollections
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

  const allowNewCollections = validateAllowNewCollections(userConfig.allowNewCollections)
  const container = validateContainer(userConfig.container)
  const defaultView = validateDefaultView(userConfig.defaultView)
  const lang = validateLang(userConfig.lang)
  const panels = validatePanels(userConfig.panels)
  const showGlobalTree = validateGlobalTree(userConfig.showGlobalTree)
  const showAddNewPanelButton = validateShowNewCollectionButton(userConfig.showAddNewPanelButton)
  const rootCollections = validateRootCollections(userConfig.rootCollections)
  const title = validateTitle(userConfig.title)
  const theme = validateTheme(userConfig.theme)
  const translations = validateTranslations(userConfig.translations)

  const mergedTranslations: Record<string, Translation> = {}
  const defaultLangs = ['en', 'de']
  const language = getLanguage(lang.result, translations.result, defaultLangs)
  const defaultTranslations =  language === 'en' ? enTranslations : language === 'de' ? deTranslations : {}
  mergedTranslations[language] = { ...defaultTranslations, ...translations.result?.[language] }


  const errors = {
    ...allowNewCollections.errors,
    ...container.errors,
    ...defaultView.errors,
    ...lang.errors,
    ...panels.errors,
    ...rootCollections.errors,
    ...showGlobalTree.errors,
    ...showAddNewPanelButton.errors,
    ...theme.errors,
    ...title.errors,
    ...translations.errors,
  }

  const config: AppConfig = {
    allowNewCollections: allowNewCollections.result,
    container: container.result,
    panels: panels.result,
    defaultView: defaultView.result,
    lang: lang.result,
    rootCollections: rootCollections.result,
    showGlobalTree: showGlobalTree.result,
    showAddNewPanelButton: showAddNewPanelButton.result,
    theme: theme.result,
    title: title.result,
    translations: mergedTranslations,
  }

  return { config, errors }
}
