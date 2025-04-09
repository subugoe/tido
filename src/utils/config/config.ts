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
          errors['debug'] = 'must be a string'
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

function validateShowNewCollectionButton(input: unknown): ValidationResult<Config['showNewCollectionButton']> {
  const errors: Record<string, string> = {}
  const result =
    typeof input === 'boolean'
      ? input
      : (() => {
        if (input !== undefined)
          errors['debug'] = 'must be a boolean'
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


export function mergeAndValidateConfig(
  userConfig: Partial<Config>,
): { config: Config; errors: Record<string, string> } {

  const container = validateContainer(userConfig.container)
  const panels = validatePanels(userConfig.panels)
  const showNewCollectionButton = validateShowNewCollectionButton(userConfig.showNewCollectionButton)
  const theme = validateTheme(userConfig.theme)

  const errors = {
    ...container.errors,
    ...panels.errors,
    ...showNewCollectionButton.errors,
    ...theme.errors
  }

  const config: Config = {
    container: container.result,
    panels: panels.result,
    showNewCollectionButton: showNewCollectionButton.result,
    theme: theme.result
  }

  return { config, errors }
}
