/* eslint-disable @typescript-eslint/no-explicit-any */

import { defaultConfig } from '@/utils/config/default-config.ts'

import enTranslations from '../../../public/translations/en.json'
import deTranslations from '../../../public/translations/de.json'
import { TidoConfig, Translation, TranslationsConfig, PanelMode } from '@/types'

type ValidationResult<T> = {
  result: T;
  errors: Record<string, string>;
};

function validateAllowNewCollections(input: any): ValidationResult<TidoConfig['allowNewCollections']> {
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

function validateContainer(input: any): ValidationResult<TidoConfig['container']> {
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

function validateDefaultPanelMode(input: any): ValidationResult<TidoConfig['defaultPanelMode']> {
  const errors: Record<string, string> = {}
  const result =
    typeof input === 'string' && ['swap', 'split', 'text', 'image'].includes(input)
      ? input as PanelMode
      : (() => {
        if (input !== undefined)
          errors['defaultPanelMode'] = 'defaultPanelMode must be a string'
        return defaultConfig.defaultPanelMode
      })()
  return { result, errors }
}

function validateGlobalTree(input: any): ValidationResult<TidoConfig['showGlobalTree']> {
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

function validateShowThemeToggle(input: any): ValidationResult<TidoConfig['showThemeToggle']> {
  const errors: Record<string, string> = {}
  const result =
    typeof input === 'boolean'
      ? input
      : (() => {
        if (input !== undefined)
          errors['showThemeToggle'] = 'must be a boolean'
        return defaultConfig.showThemeToggle
      })()
  return { result, errors }
}

function validateShowPanelPlaceholder(input: any): ValidationResult<TidoConfig['showPanelPlaceholder']> {
  const errors: Record<string, string> = {}
  const result =
    typeof input === 'boolean'
      ? input
      : (() => {
        if (input !== undefined)
          errors['showPanelPlaceholder'] = 'must be a boolean'
        return defaultConfig.showPanelPlaceholder
      })()
  return { result, errors }
}

function validatePanels(input: any): ValidationResult<TidoConfig['panels']> {
  const errors: Record<string, string> = {}
  const result = Array.isArray(input) ? input : (() => {
    if (input !== undefined)
      errors['panels'] = 'must be an array'
    return defaultConfig.panels ?? []
  })()

  return { result, errors }
}

function validateShowNewCollectionButton(input: any): ValidationResult<TidoConfig['showAddNewPanelButton']> {
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

function validateTheme(input: any): ValidationResult<TidoConfig['theme']> {
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

function validateLang(input: any): ValidationResult<TidoConfig['lang']> {
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

function validateTitle(input: any): ValidationResult<TidoConfig['title']> {
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

function validateTranslations(input: any): ValidationResult<TidoConfig['translations']> {
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

function validatePanelModes(input: any): ValidationResult<TidoConfig['panelModes']> {
  const defaultPanelModes: PanelMode[] = ['swap', 'split', 'text', 'image']
  const errors: Record<string, string> = {}

  const result = Array.isArray(input) ? input.filter(item => defaultPanelModes.includes(item)) : (() => {
    if (input !== undefined)
      errors['panelModes'] = 'must be an array'
    return defaultConfig.panelModes ?? []
  })()

  return { result, errors }
}

function validateRootCollections(input: any): ValidationResult<TidoConfig['rootCollections']> {
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

function getLanguage(lang: string, translations: TranslationsConfig, defaultLangs: string[]): string {
  if (Object.keys(translations).includes(lang) || defaultLangs.includes(lang)) return lang
  return 'en'
}

export function mergeAndValidateConfig(
  userConfig: Partial<TidoConfig>,
): { config: TidoConfig; errors: Record<string, string> } {

  const allowNewCollections = validateAllowNewCollections(userConfig.allowNewCollections)
  const container = validateContainer(userConfig.container)
  const panelModes = validatePanelModes(userConfig.panelModes)
  const defaultPanelMode = validateDefaultPanelMode(userConfig.defaultPanelMode)
  const lang = validateLang(userConfig.lang)
  const panels = validatePanels(userConfig.panels)
  const showAddNewPanelButton = validateShowNewCollectionButton(userConfig.showAddNewPanelButton)
  const showGlobalTree = validateGlobalTree(userConfig.showGlobalTree)
  const showPanelPlaceholder = validateShowPanelPlaceholder(userConfig.showPanelPlaceholder)
  const showThemeToggle = validateShowThemeToggle(userConfig.showThemeToggle)
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
    ...defaultPanelMode.errors,
    ...lang.errors,
    ...panels.errors,
    ...rootCollections.errors,
    ...showAddNewPanelButton.errors,
    ...showGlobalTree.errors,
    ...showPanelPlaceholder.errors,
    ...showThemeToggle.errors,
    ...theme.errors,
    ...title.errors,
    ...translations.errors,
    ...panelModes.errors,
  }

  const config: TidoConfig = {
    allowNewCollections: allowNewCollections.result,
    container: container.result,
    panels: panels.result,
    defaultPanelMode: defaultPanelMode.result,
    lang: lang.result,
    rootCollections: rootCollections.result,
    showAddNewPanelButton: showAddNewPanelButton.result,
    showGlobalTree: showGlobalTree.result,
    showPanelPlaceholder: showPanelPlaceholder.result,
    showThemeToggle: showThemeToggle.result,
    theme: theme.result,
    title: title.result,
    translations: mergedTranslations,
    panelModes: panelModes.result,
  }

  return { config, errors }
}
