import { defaultConfig } from '@/utils/config/default-config.ts'

import enTranslations from '../../../public/translations/en.json'
import deTranslations from '../../../public/translations/de.json'
import { TidoConfig, PanelConfig, TidoContentState, TidoContentStateTarget } from '@/types'
import { apiRequest } from '@/utils/api.ts'
import { decodeState, extractPanelConfig, hasContentState, isUrl } from '@/utils/bookmarking.ts'

type ValidationResult<T> = {
  result: T;
  errors: Record<string, string | object>;
};

function validateAllowNewCollections(input: unknown): ValidationResult<TidoConfig['allowNewCollections']> {
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

function validateContainer(input: unknown): ValidationResult<TidoConfig['container']> {
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

function validateGlobalTree(input: unknown): ValidationResult<TidoConfig['showGlobalTree']> {
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

function validateShowThemeToggle(input: unknown): ValidationResult<TidoConfig['showThemeToggle']> {
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

function validateShowPanelPlaceholder(input: unknown): ValidationResult<TidoConfig['showPanelPlaceholder']> {
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

function validatePanels(input: unknown): ValidationResult<TidoConfig['panels']> {
  const errors: Record<string, string> = {}
  const result = Array.isArray(input) ? input as TidoConfig['panels'] : (() => {
    if (input !== undefined)
      errors['panels'] = 'must be an array'
    return defaultConfig.panels ?? []
  })()

  return { result, errors }
}

function validateShowNewCollectionButton(input: unknown): ValidationResult<TidoConfig['showAddNewPanelButton']> {
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

function validateShowContentTypeToggle(input: unknown): ValidationResult<TidoConfig['showContentTypeToggle']> {
  const errors: Record<string, string> = {}
  const result =
    typeof input === 'boolean'
      ? input
      : (() => {
        if (input !== undefined)
          errors['showContentTypeToggle'] = 'must be a boolean'
        return defaultConfig.showContentTypeToggle
      })()
  return { result, errors }
}

function validateTheme(input: unknown): ValidationResult<TidoConfig['theme']> {
  const errors: Record<string, string> = {}
  const inputObj = typeof input === 'object' && input !== null ? input as Record<string, unknown> : null
  const result = {
    primaryColor:
      inputObj && typeof inputObj['primaryColor'] === 'string'
        ? inputObj['primaryColor'] as string
        : (() => {
          if (input !== undefined && inputObj && inputObj['primaryColor'] !== undefined) errors['theme.primaryColor'] = 'must be a valid rgb, hex, hsl or oklch color'
          return defaultConfig.theme?.primaryColor
        })(),
    theme:
      inputObj && (inputObj['theme'] === 'light' || inputObj['theme'] === 'dark' || inputObj['theme'] === 'system')
        ? inputObj['theme'] as 'light' | 'dark' | 'system'
        : defaultConfig.theme.theme
  }
  return { result, errors }
}

function validateLang(input: unknown): ValidationResult<TidoConfig['lang']> {
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

function validateTitle(input: unknown): ValidationResult<TidoConfig['title']> {
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

function validateTranslations(input: unknown): ValidationResult<TidoConfig['translations']> {
  const errors: Record<string, string> = {}
  const result =
      typeof input === 'object' && input !== null
        ? input as TidoConfig['translations']
        : (() => {
          if (input !== undefined)
            errors['translations'] = 'translations needs to be an object'
          return defaultConfig.translations
        })()
  return { result, errors }
}

function validatePanelViews(input: unknown): ValidationResult<TidoConfig['panelViews']> {
  const errors: Record<string, string> = {}

  if (input === undefined) return { errors, result: defaultConfig.panelViews }

  if (!Array.isArray(input)) {
    errors['panelViews'] = 'must be an array'
    return { errors, result: defaultConfig.panelViews }
  }

  if (input.length === 0) {
    errors['panelViews'] = 'must have at least 1 value'
    return { errors, result: defaultConfig.panelViews }
  }

  return { errors, result: input as TidoConfig['panelViews'] }
}


function validateRootCollections(input: unknown): ValidationResult<TidoConfig['rootCollections']> {
  const errors: Record<string, string> = {}
  const result =
    Array.isArray(input)
      ? input as TidoConfig['rootCollections']
      : (() => {
        if (input !== undefined)
          errors['rootCollections'] = 'rootCollections needs to be an array'
        return defaultConfig.rootCollections
      })()
  return { result, errors }
}

function validateShowCrossRefLabels(input: unknown): ValidationResult<TidoConfig['showCrossRefLabels']> {
  const errors: Record<string, string> = {}
  const result =
    typeof input === 'boolean'
      ? input
      : (() => {
        if (input !== undefined)
          errors['showCrossRefLabels'] = 'must be a boolean'
        return defaultConfig.showCrossRefLabels
      })()
  return { result, errors }
}

function validateAnnotations(input: unknown, defaultCfg: Partial<TidoConfig>): ValidationResult<TidoConfig['annotations']> {
  const result = (typeof input === 'object' && input !== null ? input : {}) as Partial<TidoConfig['annotations']>
  const defaultMode = defaultCfg.annotations?.defaultMode

  let errors: Record<string, object> = {
    annotations: {}
  }

  if (result?.singleMode && !['aligned', 'list'].includes(result.singleMode)) {
    (errors['annotations'] as Record<string, string>)['mode'] = 'mode is a value either "aligned" or "list"'
    result.defaultMode = defaultMode
  }

  if (!result.singleMode && !result.defaultMode) {
    result.defaultMode = defaultMode
  }

  if (!result.tooltipTypes) {
    result.tooltipTypes = []
  }

  result.crossRefContentType = typeof result.crossRefContentType === 'string'
    ? result.crossRefContentType
    : (() => {
      if (result.crossRefContentType !== undefined)
        (errors['annotations'] as Record<string, string>)['crossRefContentType'] = 'must be a string'
      return 'CrossRef'
    })()

  if (result.filters && !result.filters.rootSelectionRule) result.filters.rootSelectionRule = 'multiple'
  if (result.filters && result.filters.rootSelectionRule === 'single' && result.filters.selectedIndex === undefined) {
    result.filters.selectedIndex = 0
  }

  if (result.filters?.selectedIndex) {
    const { selectedIndex, items } = result.filters
    const itemsLength = items?.length ?? 0
    const isValidIndex = Number.isInteger(selectedIndex) && selectedIndex >= 0 && selectedIndex < itemsLength

    if (!isValidIndex) {
      if (itemsLength > 0) {
        (errors['annotations'] as Record<string, string>)['selectedIndex'] = `must be between 0 and ${itemsLength - 1}`
        result.filters.selectedIndex = 0
      } else {
        (errors['annotations'] as Record<string, string>)['selectedIndex'] = 'must be an integer'
        delete result.filters.selectedIndex
      }
    }
  }

  if (Object.keys(errors.annotations).length === 0) errors = {}

  return { result: result as TidoConfig['annotations'], errors }
}

export async function mergeAndValidateConfig(
  userConfig: Partial<TidoConfig>, defaultConfig: Partial<TidoConfig>
): Promise<{ config: TidoConfig; errors: Record<string, object | string> }> {

  const allowNewCollections = validateAllowNewCollections(userConfig.allowNewCollections)
  const container = validateContainer(userConfig.container)
  const panelViews = validatePanelViews(userConfig.panelViews)
  const lang = validateLang(userConfig.lang)
  const panels = validatePanels(userConfig.panels)
  const showAddNewPanelButton = validateShowNewCollectionButton(userConfig.showAddNewPanelButton)
  const showContentTypeToggle = validateShowContentTypeToggle(userConfig.showContentTypeToggle)
  const showGlobalTree = validateGlobalTree(userConfig.showGlobalTree)
  const showPanelPlaceholder = validateShowPanelPlaceholder(userConfig.showPanelPlaceholder)
  const showThemeToggle = validateShowThemeToggle(userConfig.showThemeToggle)
  const showCrossRefLabels = validateShowCrossRefLabels(userConfig.showCrossRefLabels)
  const rootCollections = validateRootCollections(userConfig.rootCollections)
  const title = validateTitle(userConfig.title)
  const theme = validateTheme(userConfig.theme)
  const translations = validateTranslations(userConfig.translations)
  const annotations = validateAnnotations(userConfig.annotations, defaultConfig)


  const mergedTranslations = {
    en: deepMerge(enTranslations, translations.result.en ?? {}),
    de: deepMerge(deTranslations, translations.result.de ?? {}),
    ...Object.keys(translations.result)
      .filter(key => key !== 'en' && key !== 'de')
      .reduce((acc, cur) => {
        acc[cur] = translations.result[cur]
        return acc
      }, {} as Record<string, unknown>)
  }


  const errors = {
    ...allowNewCollections.errors,
    ...container.errors,
    ...lang.errors,
    ...panels.errors,
    ...rootCollections.errors,
    ...showAddNewPanelButton.errors,
    ...showContentTypeToggle.errors,
    ...showGlobalTree.errors,
    ...showPanelPlaceholder.errors,
    ...showThemeToggle.errors,
    ...showCrossRefLabels.errors,
    ...theme.errors,
    ...title.errors,
    ...translations.errors,
    ...panelViews.errors,
    ...annotations.errors
  }

  let panelsFromContentState: PanelConfig[] | undefined
  const contentStateValue = hasContentState()

  if (contentStateValue) {
    try {
      let contentState: TidoContentState | null = null
      if (isUrl(contentStateValue)) {
        contentState = await apiRequest<TidoContentState>(contentStateValue)
      } else {
        contentState = await decodeState(contentStateValue)
      }

      if (contentState) {
        panelsFromContentState = await Promise.all(contentState.target.map(async (target: TidoContentStateTarget) => {
          let manifestIndex: number | null = null
          let itemIndex: number | null = null

          const { collectionUrl, manifestUrl, itemUrl, selectedAnnotationId } = extractPanelConfig(target)

          if (!collectionUrl) return null

          const collectionData = await apiRequest<Collection>(collectionUrl)
          manifestIndex = collectionData.sequence.findIndex(i => i.id === manifestUrl)

          if (manifestIndex === -1) {
            console.error(`Bookmarking Error: the provided manifest (${manifestUrl}) could not be found in collection (${collectionUrl})`)
          }

          const manifestData = await apiRequest<Manifest>(manifestUrl)
          itemIndex = manifestData.sequence.findIndex(i => i.id === itemUrl)

          if (itemIndex === -1) {
            console.error(`Bookmarking Error: the provided item (${itemUrl}) could not be found in manifest (${manifestUrl})`)
          }

          return {
            collection: collectionUrl,
            ...(itemIndex > -1 && { item: itemUrl }),
            ...(manifestIndex > -1 && { manifest: manifestUrl }),
            ...(selectedAnnotationId && { selectedAnnotation: selectedAnnotationId, showSidebar: true })
          }
        }))
      }
    } catch (e) {
      console.error(`Bookmarking Error: Unexpected error during reading from the bookmarking string - ${e}`)
    }
  }

  const config: TidoConfig = {
    allowNewCollections: allowNewCollections.result,
    container: container.result,
    panels: panelsFromContentState ?? panels.result,
    lang: lang.result,
    rootCollections: rootCollections.result,
    showAddNewPanelButton: showAddNewPanelButton.result,
    showContentTypeToggle: showContentTypeToggle.result,
    showGlobalTree: showGlobalTree.result,
    showPanelPlaceholder: showPanelPlaceholder.result,
    showThemeToggle: showThemeToggle.result,
    showCrossRefLabels: showCrossRefLabels.result,
    theme: theme.result,
    title: title.result,
    translations: mergedTranslations,
    panelViews: panelViews.result,
    annotations: annotations.result
  }

  return { config, errors }
}

function deepMerge<T extends Record<string, unknown>>(objectA: T, objectB: Partial<T>): T {
  const result = { ...objectA }

  for (const key in objectB) {
    if (Object.hasOwn(objectB, key)) {
      const k = key as keyof T
      if (objectB[k] instanceof Object && objectA[key] instanceof Object) {
        result[k] = deepMerge(objectA[key] as Record<string, unknown>, objectB[k] as Record<string, unknown>) as T[keyof T]
      } else {
        result[k] = objectB[k] as T[keyof T]
      }
    }
  }

  return result
}
