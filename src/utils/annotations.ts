import { AnnotationFiltersConfig, FilterNodeWithSelection, VariantType } from '@/types'
import { apiRequest } from '@/utils/api.ts'
import { getTypeValue } from '@/utils/filter-tree.ts'
import { CustomError } from '@/utils/custom-error.ts'
import type { SyncedTargetRef, SynopsisConnection } from '@/store/SynopsisStore.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { ANNOTATION_TARGET_JSON_FORMAT } from '@/utils/constants.ts'

function getSelectedTypes(config: AnnotationFiltersConfig): AnnotationTypesDict {
  let types: AnnotationTypesDict = {}

  const isSingleRoot = config.rootSelectionRule === 'single'

  if (isSingleRoot) {
    return getSelectedTypesFromNode(config.items[config.selectedIndex])
  } else {
    config.items.forEach(node => {
      const nodeTypes = getSelectedTypesFromNode(node)
      types = { ...types, ...nodeTypes }
    })
  }

  return types
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
      const childTypes = getSelectedTypesFromNode(child)
      Object.keys(childTypes).forEach(key => {
        const existing = types[key] || []
        const incoming = childTypes[key] || []
        types[key] = [...existing, ...incoming]
      })
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
  return itemAnnotations.filter((annot)  => getSource(annot.target[0]).id === annotation.id)
}

function findTargetsInsideAnnotation(annotationId: string, itemAnnotations: Annotation[]) {
  const nestedAnnotations = itemAnnotations.filter((annot) => getSource(annot.target[0])?.id === annotationId)
  const selectors: string[] = []

  nestedAnnotations.forEach((annot) => {
    // TODO: we need to handle Range selectors
    const cssValue = getSelectorValue(annot.target[0])
    if (cssValue) selectors.push(cssValue)
  })
  return selectors
}

function findTargets(annotation: Annotation): (string | null)[] {
  // TODO: include case of Range Selectors
  return annotation.target.map((target) => getSelectorValue(target))
}

function isFiltered(annotation: Annotation, selectedTypes: AnnotationTypesDict, tooltipTypes: string[] = []) {
  const type = (annotation.body as AnnotationBody).annotationType
  if (tooltipTypes.includes(type)) return true

  if (!selectedTypes || !selectedTypes[type]) return false

  if (type === 'Variant') {
    const witnesses = (annotation.body as AnnotationBody).witnesses
    return witnesses.some(witness => selectedTypes['Variant'].includes(witness))
  }

  return true
}

async function getCrossRefInfo(annotation: Annotation): Promise<CrossRefInfo> {
  // annotation: CrossRefAnnotation which contains the cross ref data, from which we extract the desired information
  const isCrossRefInAnnotation = !annotation.body.source.id.endsWith('.html')

  const source = annotation.body.source
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

      failedRequestUrl = annotationCollection.first
      const annotationPage = await apiRequest<AnnotationPage>(annotationCollection.first)

      refAnnotation = annotationPage.items.find(annotation => annotation.id === refAnnotationId)
      contentUrl = getSource(refAnnotation?.target?.[0]).id
    } else {
      contentUrl = source?.id
    }
  } catch(e) {
    throw new CustomError(`Error loading data in Cross Ref. Failed request: ${failedRequestUrl}`, e.message || String(e))
  }

  const refContentType = refItemData?.contents?.find(c => c.id === contentUrl)?.contentType?.split('type=')[1]

  return {
    collection: source.collection,
    manifest: source.manifest,
    item: source.item,
    textType: isCrossRefInAnnotation ? 'annotation': 'text',
    contentType: refContentType,
    ...(isCrossRefInAnnotation && { selectedAnnotation: { annotation: refAnnotation, origin: 'cross-ref' } }),
    ...(!isCrossRefInAnnotation && { selector: annotation.body.selector?.value }),
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
// element, and collect that target's siblings (retrieved by source.id + selector).
function getSyncedTargets(clickedEl: HTMLElement, source: string, targetSyncAnnotations: Annotation[]): SyncedTargetRef[] {
  const result: SyncedTargetRef[] = []

  targetSyncAnnotations.forEach((annotation) => {
    // the annotation's target that belongs to this source and is the clicked element
    const ownTarget = annotation.target.find((t) => {
      const selector = getSelectorValue(t)
      return getSource(t).id === source && selector && clickedEl.matches(selector)
    })
    if (!ownTarget) return

    annotation.target
      .filter((sibling) => sibling !== ownTarget)
      .map((sibling) => ({ source: getSource(sibling), selector: getSelectorValue(sibling) }))
      .filter((ref): ref is SyncedTargetRef => Boolean(ref.source?.id && ref.selector))
      .forEach((ref) => {
        const exists = result.some((e) => e.source.id === ref.source.id && e.selector === ref.selector)
        if (!exists) result.push(ref)
      })
  })

  return result
}

// Whether an element belongs to the given synopsis connection - either as its navigated target or
// as one of the synced targets of the given source, resolved by selector within the container.
function isPartOfActiveSynopsisConnection(
  el: HTMLElement,
  connection: SynopsisConnection,
  source: string,
  container: HTMLElement | null
): boolean {
  return el === connection.navigatedTarget ||
    connection.otherSyncedTargets.some((syncedTarget) =>
      syncedTarget.source.id === source &&
      container?.querySelector(syncedTarget.selector) === el
    )
}

export {
  getSelectedTypes,
  getSelectedTypesFromNode,
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
  isPartOfActiveSynopsisConnection
}
