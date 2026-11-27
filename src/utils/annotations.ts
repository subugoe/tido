import { AnnotationFiltersConfig, FilterNodeWithSelection, VariantType } from '@/types'
import { apiRequest } from '@/utils/api.ts'
import { getTypeValue } from '@/utils/filter-tree.ts'
import { CustomError } from '@/utils/custom-error.ts'
import { useDataStore } from '@/store/DataStore.tsx'
import { ANNOTATION_TARGET_JSON_FORMAT } from '@/utils/constants.ts'
import { getContentType } from '@/utils/panel-views.ts'
import { getParsedText } from '@/utils/text.ts'
import {
  getAnnotationTargets,
  getAnnotationType,
  getFirstPageUrl,
  getPageAnnotations,
  getResourceBody,
  getTextualBody
} from '@/utils/annotation-data.ts'

function getSelectedTypes(config: AnnotationFiltersConfig): AnnotationTypesDict {
  let types: AnnotationTypesDict = {}

  const isSingleRoot = config.rootSelectionRule === 'single'

  if (isSingleRoot) {
    return getSelectedTypesFromNode(config.items[config.selectedIndex])
  } else {
    for (const node of config.items) {
      types = mergeTypes(types, getSelectedTypesFromNode(node))
    }
  }

  return types
}

function mergeTypes(target: AnnotationTypesDict, source: AnnotationTypesDict): AnnotationTypesDict {
  const result: AnnotationTypesDict = { ...target }
  Object.keys(source).forEach(key => {
    result[key] = [...(result[key] ?? []), ...(source[key] ?? [])]
  })
  return result
}

function getSelectedTypesFromNode(node: FilterNodeWithSelection): AnnotationTypesDict {
  let types: AnnotationTypesDict = {}
  if (node.selected && node.types) {
    // Otherwise we set each type on the node as key in the result object.
    types = node.types.reduce((acc, cur) => {
      const typeValue = getTypeValue(cur)

      if (typeValue === 'Variant') {
        acc['Variant'] = [
          ...(acc['Variant'] ?? []),
          (cur as VariantType)['Variant']
        ]
      } else {
        acc[cur as string] = [] // Empty array just to have default value for the key.
      }

      return acc
    }, types)
  }

  if (node.items) {
    node.items.forEach(child => {
      // mergeTypes(target, source), which joins the arrays for each key instead of overwriting them.
      types = mergeTypes(types, getSelectedTypesFromNode(child))
    })
  }

  return types
}

function getFilteredAnnotations(matchedAnnotationsMap: MatchedAnnotationsMap) {
  return Object.values(matchedAnnotationsMap).reduce<Annotation[]>((acc, value) => {
    if (value.filtered === true) acc.push(value.annotation)
    return acc
  }, [])
}

function getNestedAnnotations(annotation: Annotation, itemAnnotations: Annotation[]) {
  if (itemAnnotations.length === 0) return []
  return itemAnnotations.filter((annot)  => getSource(getAnnotationTargets(annot)[0]).id === annotation.id)
}

function findTargetsInsideAnnotation(annotationId: string, itemAnnotations: Annotation[]) {
  const nestedAnnotations = itemAnnotations.filter((annot) => getSource(getAnnotationTargets(annot)[0])?.id === annotationId)
  const selectors: string[] = []

  nestedAnnotations.forEach((annot) => {
    // TODO: we need to handle Range selectors
    const cssValue = getSelectorValue(getAnnotationTargets(annot)[0])
    if (cssValue) selectors.push(cssValue)
  })
  return selectors
}

function findTargets(annotation: Annotation): (string | null)[] {
  // TODO: include case of Range Selectors
  return getAnnotationTargets(annotation).map((target) => getSelectorValue(target))
}

function isFiltered(annotation: Annotation, selectedTypes: AnnotationTypesDict, tooltipTypes: string[] = []) {
  const type = getAnnotationType(annotation)
  if (tooltipTypes.includes(type)) return true

  if (!selectedTypes || !selectedTypes[type]) return false

  if (type === 'Variant') {
    const witnesses = getTextualBody(annotation)?.witnesses ?? []
    return witnesses.some(witness => selectedTypes['Variant'].includes(witness))
  }

  return true
}

async function getCrossRefInfo(annotation: Annotation): Promise<CrossRefInfo> {
  // annotation: CrossRefAnnotation which contains the cross ref data, from which we extract the desired information
  const body = getResourceBody(annotation)
  const isCrossRefInAnnotation = !body.source.id.endsWith('.html')

  const source = body.source
  let refItemData: Item = null
  const refAnnotationId = source?.id
  let refAnnotation
  let contentUrl: string
  let failedRequestUrl: string

  try {
    failedRequestUrl = source.item
    refItemData = await useDataStore.getState().initItem(source.item)

    if (isCrossRefInAnnotation) {
      failedRequestUrl = refItemData.annotationCollection
      const annotationCollection = await apiRequest<AnnotationCollection>(refItemData.annotationCollection)

      failedRequestUrl = getFirstPageUrl(annotationCollection)
      const annotationPage = await apiRequest<AnnotationPage>(getFirstPageUrl(annotationCollection))

      refAnnotation = getPageAnnotations(annotationPage).find(annotation => annotation.id === refAnnotationId)
      contentUrl = getSource(getAnnotationTargets(refAnnotation)[0]).id
    } else {
      contentUrl = source?.id
    }
  } catch(e) {
    throw new CustomError(`Error loading data in Cross Ref. Failed request: ${failedRequestUrl}`, e.message || String(e), e.options)
  }

  const refContent = refItemData?.contents?.find(c => c.id === contentUrl)
  const refContentType = refContent ? getContentType(refContent) : undefined

  return {
    collection: source.collection,
    manifest: source.manifest,
    item: source.item,
    textType: isCrossRefInAnnotation ? 'annotation': 'text',
    contentType: refContentType,
    ...(isCrossRefInAnnotation && { selectedAnnotation: { annotation: refAnnotation, origin: 'cross-ref' } }),
    ...(!isCrossRefInAnnotation && { selector: body.selector?.value }),
    refItemData
  }
}

function getSource(target: AnnotationTarget): AnnotationTargetSource {
  if (typeof target.source === 'object') {
    return target.source
  }
  return { id: target.source }
}

// The css selector of a target sits at a different place depending on what the target references,
// which we tell apart by its format:
// - `application/ld+json`: the target references another annotation. Its JsonPathSelector points at
//   the field holding the markup (`$.body.value`) and the css selector applying within that markup
//   sits in `refinedBy`.
// - anything else (`text/html`, or absent on older data): the target references a text content file
//   and carries the css selector directly.
// Only CssSelectors carry a `value`. RangeSelectors are not handled yet (see findTargets below).
function getSelectorValue(target: AnnotationTarget): string | null {
  if (!target?.selector) return null

  if (isAnnotationTarget(target)) {
    const { refinedBy } = target.selector
    return refinedBy?.type === 'CssSelector' ? refinedBy.value : null
  }

  return target.selector.type === 'CssSelector' ? target.selector.value : null
}

// Whether the target references another annotation rather than a text content file.
function isAnnotationTarget(target: AnnotationTarget): target is AnnotationInAnnotationTarget {
  return target?.format === ANNOTATION_TARGET_JSON_FORMAT
}

// Resolve the targets that `clickedEl` (which lives in `source`) is synced with, on demand: from
// the clicked target's sync annotations, keep the ones whose own-source target is the clicked
// element, and collect that target's siblings (retrieved by source.id + selector) - grouped by the
// sync annotation they come from, one sync connection each, keyed by the annotation id.
function getSyncedTargets(clickedEl: HTMLElement, source: string, targetSyncAnnotations: Annotation[]): SyncedTargetsMap {
  const result: SyncedTargetsMap = {}

  targetSyncAnnotations.forEach((annotation) => {
    // the annotation's target that belongs to this source and is the clicked element
    const targets = getAnnotationTargets(annotation)
    const ownTarget = targets.find((t) => {
      const selector = getSelectorValue(t)
      return getSource(t).id === source && selector && clickedEl.matches(selector)
    })
    if (!ownTarget) return

    const connectionTargets: SyncedTargetRef[] = []
    targets
      .filter((sibling) => sibling !== ownTarget)
      .map((sibling) => ({ source: getSource(sibling), selector: getSelectorValue(sibling) }))
      .filter((ref): ref is SyncedTargetRef => Boolean(ref.source?.id && ref.selector)) // && ref.source.id !== source)
      .forEach((ref) => {
        const exists = connectionTargets.some((e) => getTargetKey(e) === getTargetKey(ref))
        if (!exists) connectionTargets.push(ref)
      })

    // an annotation without an id still gets a connection of its own
    if (connectionTargets.length > 0) {
      result[annotation.id ?? `sync_connection_${Object.keys(result).length + 1}`] = connectionTargets
    }
  })

  return result
}

// All synced targets of the given sync connections in one list - a target that is part of several
// connections only once.
function flattenSyncedTargets(syncedTargets: SyncedTargetsMap): SyncedTargetRef[] {
  const result = new Map<string, SyncedTargetRef>()
  Object.values(syncedTargets).forEach((targets) => targets.forEach((target) => {
    const key = getTargetKey(target)
    if (!result.has(key)) result.set(key, target)
  }))
  return [...result.values()]
}

// Whether an element belongs to the given synopsis connection - either as its navigated target or
// as one of the synced targets of the given source, matched by selector within the container (a
// selector may match several elements).
function isPartOfActiveSynopsisConnection(
  el: HTMLElement,
  connection: SynopsisConnection,
  source: string,
  container: HTMLElement | null
): boolean {
  return el === connection.navigatedTarget ||
    flattenSyncedTargets(connection.otherSyncedTargets).some((syncedTarget) =>
      syncedTarget.source.id === source &&
      !!container?.contains(el) &&
      el.matches(syncedTarget.selector)
    )
}
// why a witness can not be navigated to - each is also the translation key of its tooltip description
type WitnessError = 'witness_text_not_in_item' | 'witness_target_not_found'

// Identifies a synced target: a text (source.id) can have several targets, distinguished by their selector
function getTargetKey({ source, selector }: SyncedTargetRef): string {
  return `${source.id}|${selector}`
}

// A witness (manifest) with its synced targets: syncTarget is the first of them, count how many there are
interface WitnessTargets {
  syncTarget: SyncedTargetRef
  count: number
}

// Identifies the witness of a synced target: its manifest, or its text when it has no manifest
function getWitnessKey({ source }: SyncedTargetRef): string {
  return source.manifest ?? source.id
}

// An entry of the witness list: the valid or the invalid synced targets of one witness (manifest)
interface WitnessEntry {
  // getWitnessKey for the valid entry, suffixed with '|invalid' for the invalid one
  key: string
  targets: SyncedTargetRef[]
  // set on the invalid entry - the error of its first target
  error?: WitnessError
}

// Groups synced targets by their witness (manifest), in the order of the first target of each witness.
// The valid and the invalid targets of a witness are split into two entries: the valid one first,
// then the invalid one, which is shown disabled.
function groupTargetsByWitness(targets: SyncedTargetRef[], errors: Record<string, WitnessError>): WitnessEntry[] {
  const witnesses = new Map<string, { valid: SyncedTargetRef[], invalid: SyncedTargetRef[] }>()
  targets.forEach((st) => {
    const key = getWitnessKey(st)
    if (!witnesses.has(key)) witnesses.set(key, { valid: [], invalid: [] })
    const witness = witnesses.get(key)!
    if (errors[getTargetKey(st)]) witness.invalid.push(st)
    else witness.valid.push(st)
  })

  return [...witnesses.entries()].flatMap(([key, { valid, invalid }]) => {
    const entries: WitnessEntry[] = []
    if (valid.length > 0) entries.push({ key, targets: valid })
    if (invalid.length > 0) entries.push({ key: `${key}|invalid`, targets: invalid, error: errors[getTargetKey(invalid[0])] })
    return entries
  })
}

// A sync connection of the popover: its key in the SyncedTargetsMap and its witness entries
interface ConnectionEntry {
  key: string
  witnesses: WitnessEntry[]
}

// Groups the synced targets of every sync connection by their witness (see groupTargetsByWitness),
// in the order of the connections.
function groupConnectionsByWitness(syncedTargets: SyncedTargetsMap, errors: Record<string, WitnessError>): ConnectionEntry[] {
  return Object.entries(syncedTargets).map(([key, targets]) => ({ key, witnesses: groupTargetsByWitness(targets, errors) }))
}

// Checks that the witness text (source.id) is a content of its item (source.item) and that the
// synced target (selector) exists in that text. Returns the first failing check, or null.
async function validateWitness({ source, selector }: SyncedTargetRef): Promise<WitnessError | null> {
  if (!source.item) return 'witness_text_not_in_item'

  const item = await useDataStore.getState().initItem(source.item)
  if (!item.contents?.some((content) => content.id === source.id)) return 'witness_text_not_in_item'

  const doc = await getParsedText(source.id)
  let targetEl: Element | null = null
  try {
    targetEl = doc.querySelector(selector)
  } catch {
    // invalid css selector - treated as target not found
  }
  if (!targetEl) return 'witness_target_not_found'

  return null
}

export type { ConnectionEntry, WitnessEntry, WitnessError, WitnessTargets }

export {
  getTargetKey,
  getWitnessKey,
  groupTargetsByWitness,
  groupConnectionsByWitness,
  validateWitness,
  getSelectedTypes,
  getSelectedTypesFromNode,
  mergeTypes,
  getFilteredAnnotations,
  isFiltered,
  findTargetsInsideAnnotation,
  findTargets,
  getNestedAnnotations,
  getCrossRefInfo,
  getSource,
  getSelectorValue,
  isAnnotationTarget,
  getSyncedTargets,
  flattenSyncedTargets,
  isPartOfActiveSynopsisConnection
}
