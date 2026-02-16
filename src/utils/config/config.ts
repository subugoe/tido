/* eslint-disable @typescript-eslint/no-explicit-any */

const DEFAULT_ANNOTATIONS_MODE = 'aligned'

import { defaultConfig } from '@/utils/config/default-config.ts'

import enTranslations from '../../../public/translations/en.json'
import deTranslations from '../../../public/translations/de.json'
import { TidoConfig, PanelMode, PanelConfig, FilterNode } from '@/types'
import { apiRequest } from '@/utils/api.ts'
import { decodeState, extractPanelConfig, hasContentState, isUrl } from '@/utils/bookmarking.ts'

type ValidationResult<T> = {
  result: T;
  errors: Record<string, string | object>;
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
          if (input !== undefined && input['primaryColor'] !== undefined) errors['theme.primaryColor'] = 'must be a valid rgb, hex, hsl or oklch color'
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

  if (input === undefined) return { errors, result: defaultConfig.panelModes }

  if (!Array.isArray(input)) {
    errors['panelModes'] = 'must be an array'
    return { errors, result: defaultConfig.panelModes }
  }

  if (input.length === 0) {
    errors['panelModes'] = 'must have at least 1 value'
    return { errors, result: defaultConfig.panelModes }
  }

  const corruptValues = input.filter(item => !defaultPanelModes.includes(item))
  if (corruptValues.length) {
    errors['panelModes'] = `${corruptValues.join(', ')} ${corruptValues.length > 1 ? 'are' : 'is'} not valid. Please use only ${defaultPanelModes.join(', ')}`
    return { errors, result: defaultConfig.panelModes }
  }

  return { errors, result: input }
}


function validateRootCollections(input: any): ValidationResult<TidoConfig['rootCollections']> {
  const errors: Record<string, string> = {}
  const result =
    Array.isArray(input)
      ? input
      : (() => {
        if (input !== undefined)
          errors['rootCollections'] = 'rootCollections needs to be an array'
        return defaultConfig.rootCollections
      })()
  return { result, errors }
}

function validateAnnotations(input: any): ValidationResult<TidoConfig['annotations']> {
  const result = { ...input }

  const errors: Record<string, object> = {
    'annotations': {}
  }

  if (!result.filters && !result.types) {
    errors['annotations']['filters'] = 'did not find "filters" or "types" key'
  }

  if (result?.singleMode && !['aligned', 'list'].includes(result.singleMode)) {
    // if 'singleMode' is provided wrong -> we provide both modes to user
    errors['annotations']['mode'] = 'mode is a value either "aligned" or "list"'
    result.defaultMode = DEFAULT_ANNOTATIONS_MODE
  }

  if (!result.singleMode && !result.defaultMode) {
    // none between 'singleMode' and 'defaultMode' is provided -> both modes are provided
    result.defaultMode = DEFAULT_ANNOTATIONS_MODE
  }

  if (result.filters && !result.filters.rootSelectionRule) result.filters.rootSelectionRule = 'multiple'

  function validateNode(node: FilterNode) {
    node.selected = Object.hasOwn(node, 'selected') ? node.selected : false

    if (node.items) {
      node.items.forEach(item => validateNode(item))
    }
    return node
  }

  if (result.filters) {
    result.filters.items = result.filters.items.map((item) => validateNode(item))
  }

  return { result, errors }
}

export async function mergeAndValidateConfig(
  userConfig: Partial<TidoConfig>,
): Promise<{ config: TidoConfig; errors: Record<string, object | string> }> {

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
  const annotations = validateAnnotations(userConfig.annotations)


  const mergedTranslations = {
    en: deepMerge(enTranslations, translations.result.en ?? {}),
    de: deepMerge(deTranslations, translations.result.de ?? {}),
    ...Object.keys(translations.result)
      .filter(key => key !== 'en' && key !== 'de')
      .reduce((acc, cur) => {
        acc[cur] = translations.result[cur]
        return acc
      }, {})
  }


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
    ...annotations.errors
  }

  let panelsFromContentState: PanelConfig[]
  const contentStateValue = hasContentState()

  if (contentStateValue) {
    try {
      let contentState = null
      if (isUrl(contentStateValue)) {
        contentState = await apiRequest(contentStateValue)
      } else {
        contentState = await decodeState(contentStateValue)
      }

      panelsFromContentState = await Promise.all(contentState.target.map(async (target) => {
        let manifestIndex = null
        let itemIndex = null

        const { collectionUrl, manifestUrl, itemUrl } = extractPanelConfig(target)

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
        }
      }))
    } catch (e) {
      console.error(`Bookmarking Error: Unexpected error during reading from the bookmarking string - ${e}`)
    }
  }

  const config: TidoConfig = {
    allowNewCollections: allowNewCollections.result,
    container: container.result,
    panels: panelsFromContentState ?? panels.result,
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
    annotations: annotations.result
  }

  return { config, errors }
}

function deepMerge(objectA: object, objectB: object) {
  // deep merge of two given objects
  // we take initially objectA and iterate on it with the keys of objectB. For same key we override its value from objectB. When a new key is in objectB then we append it to objectA
  const result = { ...objectA }

  for (const key in objectB) {
    if (Object.hasOwn(objectB, key)) {
      if (objectB[key] instanceof Object && objectA[key] instanceof Object) {
        result[key] = deepMerge(objectA[key], objectB[key])
      } else {
        result[key] = objectB[key]
      }
    }
  }

  return result
}
