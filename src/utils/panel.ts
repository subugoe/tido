import { usePanelStore } from '@/store/PanelStore.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { PanelConfig, PanelView, PanelViewState } from '@/types'
import { useUIStore } from '@/store/UIStore.tsx'
import { SUPPORTED_MIME_TYPES } from './constants'

// an item has an image to display when its first image has a url. No images key, an empty array or an image without url count as no image
export function hasImage(item: Item | null): boolean {
  return !!item?.images?.[0]?.id
}

// The viewsWidthRatio of a panel as positive numbers, one per view - null when it is not set or does not
// fit the views, in which case the views share the panel width equally. Values from the url are strings.
export function getViewsWidthRatio(viewsWidthRatio: unknown, viewsCount: number): number[] | null {
  if (viewsWidthRatio === undefined) return null

  const ratios = Array.isArray(viewsWidthRatio) ? viewsWidthRatio.map(Number) : []
  if (ratios.length !== viewsCount || ratios.some(r => !Number.isFinite(r) || r <= 0)) {
    console.warn(`viewsWidthRatio must have one positive number for each of the ${viewsCount} views - the views get equal widths`)
    return null
  }

  return ratios
}

// get the url of the document (collection or manifest) which will be shown in the panel
export function getManifestUrl(documentData: Manifest | Collection, documentType: string, index: number): string {
  let manifestUrl = ''
  if (documentType === 'collection') {
    const manifest = (documentData as Collection).manifests[index]
    manifestUrl = typeof manifest === 'object' ? manifest?.id ?? '' : manifest
  } else if (documentType === 'manifest') {
    manifestUrl = documentData?.id
  }

  return manifestUrl
}

export async function getManifestData(documentData: Collection | Manifest, documentType: string, index: number): Promise<Manifest> {
  const manifestUrl = getManifestUrl(documentData, documentType, index)
  return await useDataStore.getState().initManifest(manifestUrl)
}

export async function getItemData(manifestData: Manifest): Promise<Item> {
  const item = manifestData?.items?.[0]
  if (!item) throw new Error('No items found')

  const itemId = typeof item === 'object'
    ? (item as Item).id
    : item
  return await useDataStore.getState().initItem(itemId)
}


export function isItemContentValid(itemData: Item): boolean {
  if (!('contents' in itemData)) return false
  if (itemData.contents.length === 0) return false
  return true
}

export function splitMIMEType(value: string): string[] {
  return value.split(';type=')
}

// The content type of a single content: the ';type=' param, or the MIME type itself when there is none
export function getContentType(content: Content): string {
  const [type, param] = splitMIMEType(content.contentType)
  return param ?? type
}

// The supported content types of an item, in the order of its contents and without duplicates
export function getContentTypes(content: Content[]): string[] {
  const types = content
    .filter((item) => {
      const [type] = splitMIMEType(item.contentType)
      return type && SUPPORTED_MIME_TYPES.includes(type)
    })
    .map(getContentType)

  return [...new Set(types)]
}

// The content of the given content type - compared exactly, so 'translation' does not match 'translation_en'
export function findContentByType(contents: Content[] | undefined, type: string | null | undefined): Content | undefined {
  if (!type || !contents) return undefined
  return contents.find(c => getContentType(c) === type)
}

// The content types a text view offers on an item. A configured list is narrowed down to what the item
// offers, in the configured order - it can end up empty. Without a configured list the view offers all
// content types of the item, in the order of the item.
export function resolveContentTypes(itemContentTypes: string[], configuredContentTypes?: string[] | null): string[] {
  if (!configuredContentTypes || configuredContentTypes.length === 0) return itemContentTypes
  return configuredContentTypes.filter(type => itemContentTypes.includes(type))
}

// The content type a text view shows - the one place this is decided: the preferred one when offered, else
// the configured one when offered (it is replaced as preferred one by a choice of the user, but still the
// default of the view), else the first one offered. Undefined when the view offers none.
export function resolveActiveContentType(
  contentTypes: string[],
  preferredContentType?: string,
  configuredContentType?: string
): string | undefined {
  return [preferredContentType, configuredContentType].find(type => type && contentTypes.includes(type)) ?? contentTypes[0]
}

// Resolves the configuration of a view against the content types of an item. `previous` is the same view
// on the item shown before - it only hands over what the user changed: the visibility and the preferred
// content type, which is kept even when the item does not offer it, so it applies again on the next item
// that does. On a first item the configured activeContentType is the preferred one. Everything else comes
// from the configuration, never from what the view offered on the previous item.
export function resolveView(configured: PanelView, itemContentTypes: string[], previous?: PanelViewState): PanelViewState {
  const view: PanelViewState = { ...configured, visible: previous?.visible ?? configured.visible ?? true }
  if (configured.view === 'image') return view

  const contentTypes = resolveContentTypes(itemContentTypes, configured.contentTypes)
  const preferredContentType = previous ? previous.preferredContentType : configured.activeContentType

  return {
    ...view,
    contentTypes,
    activeContentType: resolveActiveContentType(contentTypes, preferredContentType, configured.activeContentType),
    ...(preferredContentType && { preferredContentType }),
    ...(contentTypes.length === 0 && { missingContentTypes: configured.contentTypes }),
  }
}

export function getUniquePanels(panels: PanelConfig[] | undefined) {
  if (!panels) return []

  const uniquePanels = panels.filter((p, index, self) =>
    index === self.findIndex((panel) => panel.collection === p.collection))

  return uniquePanels
}

export function isNewManifest(manifest: Manifest): boolean {
  const panels = usePanelStore.getState().panels

  for (const key in panels) {
    if (manifest.id === panels[key].manifest?.id) return false
  }

  return true
}

export function filterAndSortData<T extends Record<string, unknown>>( data: T[], key: string,  orderArray: string[]) {
  // data array to have its keys sorted according to 'orderArray'
  return orderArray.map(orderItem => {
    return data.find(obj => (obj[key] as string).toLowerCase() === orderItem.toLowerCase())
  })
}

// The index of the text view that can show the given content type: the first one whose content types
// include it, else the first text view - a view without content types offers every one of the item.
export function findTextViewIndexForContentType(views: PanelView[], contentType: string | null | undefined): number {
  const textViews = views.map((v, i) => ({ v, i })).filter(({ v }) => v.view === 'text')
  const offering = textViews.find(({ v }) => !v.contentTypes || v.contentTypes.length === 0 || v.contentTypes.includes(contentType))
  return (offering ?? textViews[0])?.i ?? -1
}

// Configures the view at `index` to show the given content type. Returns a new array with a new object
// for that view, so the change is an actual change (no in-place mutation of the shared views).
export function setNewActiveContentType(contentType: string, index: number, views: PanelView[]): PanelView[] {
  return views.map((v, i) => {
    if (i !== index) return v

    return { ...v, activeContentType: contentType }
  })
}

// Makes a content type the preferred one of the view at `index` of a panel, as a choice of the user - it
// replaces the configured one and is kept on the following items. The active content type is left to
// resolveView, for a choice that comes with a new item.
export function setPreferredContentType(contentType: string, index: number, views: PanelViewState[]): PanelViewState[] {
  return views.map((v, i) => {
    if (i !== index) return v

    return { ...v, preferredContentType: contentType }
  })
}

// A choice of the user on the current item: the content type becomes the preferred one of the view at
// `index` and is shown, as far as the view offers it.
export function chooseContentType(contentType: string, index: number, views: PanelViewState[]): PanelViewState[] {
  return setPreferredContentType(contentType, index, views).map((v, i) => {
    if (i !== index) return v

    return { ...v, activeContentType: resolveActiveContentType(v.contentTypes ?? [], v.preferredContentType) }
  })
}

export async function createNewPanel(
  collectionId: string,
  manifest: Manifest,
  item: Item,
  newPanelViews: PanelView[],
  newPanelId: string,
  showSidebar?: boolean,
) {
  const newPanelConfig : PanelConfig = {
    collection: collectionId,
    manifest: manifest.id,
    item: item.id,
    views: newPanelViews,
    showSidebar: showSidebar ?? false,
  }

  useUIStore.getState().updateNewestPanelId(newPanelId)
  await usePanelStore.getState().addPanel(newPanelConfig, newPanelId)
}
