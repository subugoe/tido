import { FilterNode } from '@/types'
import { apiRequest } from '@/utils/api.ts'

function getSelectedTypes(nodes: FilterNode[]): AnnotationTypesDict {
  let types: AnnotationTypesDict = {}

  nodes.forEach(node => {
    const nodeTypes = getSelectedTypesFromNode(node)
    types = { ...types, ...nodeTypes }
  })

  return types
}

function getSelectedTypesFromNode(node: FilterNode): AnnotationTypesDict {
  let types: AnnotationTypesDict = {}

  if (node.selected && node.types) {
    const isVariant = node.types.includes('Variant')

    if (isVariant) {
      // If a node has configured type "Variant", we ignore all other types and grandchildren
      // and consider only direct children as "witnesses".
      types['Variant'] = node.items?.filter(item => item.selected).map(item => item.types?.[0] ?? '') ?? []
      return types
    }

    // Otherwise we set each type on the node as key in the result object.
    types = node.types.reduce((acc, cur) => {
      acc[cur] = [] // Empty array just to have default value for the key.
      return acc
    }, types)
  }

  if (node.items) {
    node.items.forEach(child => {
      types = { ...types, ...getSelectedTypesFromNode(child) }
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
  return itemAnnotations.filter((annot)  => annot.target[0].source === annotation.id)
}

function findTargetsInsideAnnotation(annotationId: string, itemAnnotations: Annotation[]) {
  const nestedAnnotations = itemAnnotations.filter((annot) => annot.target[0]?.source === annotationId)
  const selectors: string[] = []

  nestedAnnotations.forEach((annot) => {
    const target = annot.target[0]
    if (!target?.selector) return {}
    const { selector } = target
    let cssValue: string | null = null

    if (selector.type === 'CssSelector')  cssValue = selector.value
    // TODO: we need to handle Range selectors
    if (cssValue) selectors.push(cssValue)
  })
  return selectors
}

function findTargets(annotation: Annotation): string[] {
  return annotation.target.map((target) => {
    if (target.selector.type === 'CssSelector') return target.selector.value
    // TODO: include case of Range Selectors
  })
}

function getAnnotationIdsByEl(
  flipped: Record<string, { el: HTMLElement, annotationIds: string[] }>,
  el: HTMLElement
): string[] {
  const entry = Object.values(flipped).find(v => v.el === el)
  return entry?.annotationIds ?? []
}

function isFiltered(annotation: Annotation, selectedTypes: AnnotationTypesDict, tooltipTypes: string[] = []) {
  const type = (annotation.body as AnnotationBody)['x-content-type']
  if (tooltipTypes.includes(type)) return true

  if (!selectedTypes || !selectedTypes[type]) return false

  if (type === 'Variant') {
    const witnesses = (annotation.body as AnnotationBody).witnesses
    return witnesses.some(witness => selectedTypes[type].includes(witness))
  }

  return true
}

async function getCrossRefInfo(annotation: Annotation) {
  // annotation: CrossRefAnnotation which contains the cross ref data, from which we extract the desired information
  const isCrossRefInAnnotation = !getSource(annotation?.target[0]).id.endsWith('.html')

  const source = (annotation.body as AnnotationBodyCrossRef).source
  const refItemData = await apiRequest<Item>(source.item)
  const refAnnotationId = source?.id
  let refAnnotation
  let contentUrl: string

  if (isCrossRefInAnnotation)  {
    const annotationCollection = await apiRequest<AnnotationCollection>(refItemData.annotationCollection)
    const annotationPage = await apiRequest<AnnotationPage>(annotationCollection.first)
    refAnnotation = annotationPage.items.find(annotation => annotation.id === refAnnotationId)
    contentUrl = getSource(refAnnotation?.target?.[0]).id
  }

  if (!isCrossRefInAnnotation) contentUrl = (annotation.body as AnnotationBodyCrossRef)?.source?.id
  // TODO: In Popover show error when refAnnotation is not found, due to error in CrossRef Information
  const refContentType = refItemData.content.find(c => c.url === contentUrl)?.type?.split('type=')[1]

  return {
    collection: source.collection,
    manifest: source.manifest,
    item: source.item,
    contentType: refContentType,
    ...(isCrossRefInAnnotation && { selectedAnnotation: refAnnotation }),
    ...(!isCrossRefInAnnotation && { selector: (annotation.body as AnnotationBodyCrossRef)?.selector?.value }),
    refItemData
  }
}

function getSource(target: AnnotationTarget): AnnotationTargetSource {
  if (typeof target.source === 'object') {
    return target.source
  }
  return { id: target.source }
}

function getAnnotationContentType(annotation: Annotation) {
  const body = annotation.body
  if ('x-content-type' in body) return body['x-content-type']
  return body.source?.['x-content-type']
}

export {
  getSelectedTypes,
  getFilteredAnnotations,
  isFiltered,
  findTargetsInsideAnnotation,
  findTargets,
  getNestedAnnotations,
  getAnnotationIdsByEl,
  getCrossRefInfo,
  getSource,
  getAnnotationContentType
}
