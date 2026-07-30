// Helpers to derive the expected synopsis state of a panel from the TextAPI data, instead of
// hard coding numbers in the specs. They mirror the app:
//   - sync annotations come from two sources: the annotationCollection of every collection in
//     'panels' (PanelContext) and of every collection in 'rootCollections', whose subtree is
//     walked until an annotationCollection is found (SynopsisStore.addSyncAnnotationsFromCollection).
//     Annotations are deduplicated by id across both sources.
//   - a panel renders one text per visible text view, its content url resolved from the view's
//     active content type (PanelContext.enhanceView + TextViewContext)
//   - a text contributes one sync target per element matched by the selector of a sync annotation
//     targeting that text (GenericTextRenderer), so an element referenced by several annotations
//     is counted once

// utils/constants.ts
const SUPPORTED_MIME_TYPES = ['text/html', 'text/plain', 'text/xml', 'application/xhtml+xml']

async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed request (${response.status}): ${url}`)
  return response.json()
}

async function fetchText(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed request (${response.status}): ${url}`)
  return response.text()
}

// utils/annotations.ts
function getSourceId(target) {
  return typeof target.source === 'object' ? target.source?.id : target.source
}

// utils/annotations.ts - only CssSelectors carry a value
function getSelectorValue(target) {
  return target.selector?.type === 'CssSelector' ? target.selector.value : null
}

// utils/panel.ts
function getContentTypes(contents) {
  return contents
    .map(content => content.contentType.split(';type='))
    .filter(([type]) => type && SUPPORTED_MIME_TYPES.includes(type))
    .map(([type, param]) => param ?? type)
}

// store/SynopsisStore.tsx - walk the collection tree until a collection includes an annotationCollection
async function findAnnotationCollectionUrl(collection) {
  if (collection.annotationCollection) return collection.annotationCollection
  if (!collection.collections) return null

  for (const child of collection.collections) {
    const childCollection = typeof child === 'string' ? await fetchJson(child) : child
    const found = await findAnnotationCollectionUrl(childCollection)
    if (found) return found
  }

  return null
}

/**
 * All sync annotations the app knows about, deduplicated by id.
 * @param {string[]} collectionUrls collections of the panels config plus the rootCollections
 * @returns {Promise<object[]>}
 */
export async function getSyncAnnotations(collectionUrls) {
  const annotations = []
  const seen = new Set()

  for (const collectionUrl of new Set(collectionUrls)) {
    const collection = await fetchJson(collectionUrl)
    const annotationCollectionUrl = await findAnnotationCollectionUrl(collection)
    if (!annotationCollectionUrl) continue

    const annotationCollection = await fetchJson(annotationCollectionUrl)
    const page = await fetchJson(annotationCollection.first)

    for (const annotation of page.items ?? []) {
      if (!annotation.id || seen.has(annotation.id)) continue
      seen.add(annotation.id)
      annotations.push(annotation)
    }
  }

  return annotations
}

/**
 * An item of the panel's manifest (or of the first manifest of the collection when the panel
 * config has none). Without an index the item the panel opens initially - the first one.
 */
export async function getItem({ collection: collectionUrl, manifest: manifestUrl }, itemIndex = 0) {
  const collection = await fetchJson(collectionUrl)
  const manifests = collection.manifests ?? []
  const manifestRef = manifestUrl
    ? manifests.find(m => (typeof m === 'string' ? m : m.id) === manifestUrl)
    : manifests[0]

  // always load the manifest itself - a collection may embed a shortened copy of it (the app
  // requests the manifest by url too)
  const manifest = await fetchJson(typeof manifestRef === 'string' ? manifestRef : manifestRef.id)

  const itemRef = manifest.items[itemIndex]
  return typeof itemRef === 'string' || !itemRef?.contents ? await fetchJson(itemRef.id ?? itemRef) : itemRef
}

/**
 * The texts a panel renders for the given item, in the order of the text views.
 * @returns {{ viewIndex: number, contentType: string, contentUrl: string }[]}
 */
export function getRenderedTexts(item, panelViews) {
  const itemContentTypes = getContentTypes(item.contents)

  return panelViews
    .map((view, viewIndex) => {
      if (view.view === 'image' || !(view.visible ?? true)) return null

      const isSubsetOfContentTypes = view.contentTypes?.every(type => itemContentTypes.includes(type)) ?? false
      const contentTypes = isSubsetOfContentTypes ? view.contentTypes : itemContentTypes
      const contentType = view.activeContentType ?? contentTypes[0]
      const contentUrl = item.contents.find(content => content.contentType.includes(contentType))?.id

      return contentUrl ? { viewIndex, contentType, contentUrl } : null
    })
    .filter(Boolean)
}

/**
 * The number of sync targets of a single text: the elements matched by the selectors of the sync
 * annotations targeting it. Per annotation only the first target of that source is used, exactly
 * like GenericTextRenderer does.
 */
async function countSyncTargetsOfText(contentUrl, syncAnnotations) {
  const dom = new DOMParser().parseFromString(await fetchText(contentUrl), 'text/html')
  const targetElements = new Set()

  syncAnnotations.forEach(annotation => {
    const target = annotation.target.find(t => getSourceId(t) === contentUrl)
    const selector = target ? getSelectorValue(target) : null
    if (!selector) return

    dom.querySelectorAll(selector).forEach(el => targetElements.add(el))
  })

  return targetElements.size
}

/**
 * The sync targets of a panel, per rendered text. The Sync Target Navigation of that panel counts
 * the sum of the counts of all currently visible texts.
 * @returns {Promise<{ viewIndex: number, contentType: string, contentUrl: string, count: number }[]>}
 */
export async function getSyncTargetCounts(panelConfig, panelViews, syncAnnotations, itemIndex = 0) {
  const item = await getItem(panelConfig, itemIndex)
  const texts = getRenderedTexts(item, panelViews)

  const counts = []
  for (const text of texts) {
    counts.push({ ...text, count: await countSyncTargetsOfText(text.contentUrl, syncAnnotations) })
  }

  return counts
}

/**
 * @param {{ contentType: string, count: number }[]} counts
 * @param {string[]} [contentTypes] the content types of the visible texts - all of them when omitted
 */
export function sumSyncTargets(counts, contentTypes) {
  return counts
    .filter(({ contentType }) => !contentTypes || contentTypes.includes(contentType))
    .reduce((total, { count }) => total + count, 0)
}

/**
 * The views a panel keeps while it navigates to another item of the same manifest: visibility and
 * active content type are preserved (PanelContext reuses the panelViews of the panel state), so the
 * counts of another item have to be computed with the content types that are currently rendered.
 * @param {object[]} panelViews
 * @param {{ viewIndex: number, contentType: string }[]} texts the texts currently rendered
 */
export function getActiveViews(panelViews, texts) {
  return panelViews.map((view, viewIndex) => {
    const text = texts.find(t => t.viewIndex === viewIndex)
    return text ? { ...view, activeContentType: text.contentType } : { ...view, visible: false }
  })
}

// utils/scroller.ts - the "focused" band of a scroll container: a target overlapping it drives the
// synopsis scroll sync of the other texts
export const SYNC_SCROLL_THRESHOLD_TOP = 0.35
export const SYNC_SCROLL_THRESHOLD_BOTTOM = 0.45

/**
 * Position of a target within the visible height of its scroll container.
 */
export function getTargetPosition(scrollContainer, selector) {
  const target = scrollContainer.querySelector(selector)
  const containerRect = scrollContainer.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()

  return {
    top: targetRect.top - containerRect.top,
    bottom: targetRect.bottom - containerRect.top,
    height: scrollContainer.clientHeight
  }
}

/**
 * Whether a target overlaps the sync band of its scroll container - mirrors findFocusedTarget of
 * utils/scroller.ts (without its extension of the band when scrolled near the bottom).
 */
export function isInSyncBand(scrollContainer, selector) {
  const { top, bottom, height } = getTargetPosition(scrollContainer, selector)
  return top < height * SYNC_SCROLL_THRESHOLD_BOTTOM && bottom > height * SYNC_SCROLL_THRESHOLD_TOP
}

export const Synopsis = {
  getSyncAnnotations,
  getItem,
  getRenderedTexts,
  getSyncTargetCounts,
  getActiveViews,
  sumSyncTargets,
  getTargetPosition,
  isInSyncBand,
}
