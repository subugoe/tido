/* eslint-disable @typescript-eslint/no-explicit-any */

import { defaultConfig } from '@/utils/config/default-config.ts'

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

export function mergeAndValidateConfig(
  userConfig: Partial<AppConfig>,
): { config: AppConfig; errors: Record<string, string> } {

  const container = validateContainer(userConfig.container)
  const panels = validatePanels(userConfig.panels)
  const showGlobalTree = validateGlobalTree(userConfig.showGlobalTree)
  const showNewCollectionButton = validateShowNewCollectionButton(userConfig.showNewCollectionButton)
  const theme = validateTheme(userConfig.theme)

  const errors = {
    ...container.errors,
    ...panels.errors,
    ...showGlobalTree.errors,
    ...showNewCollectionButton.errors,
    ...theme.errors
  }

  const config: AppConfig = {
    container: container.result,
    panels: panels.result,
    showGlobalTree: showGlobalTree.result,
    showNewCollectionButton: showNewCollectionButton.result,
    theme: theme.result
  }

  return { config, errors }
}
