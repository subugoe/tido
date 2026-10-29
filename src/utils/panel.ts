import { usePanelStore } from '@/store/PanelStore.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { PanelConfig, PanelView } from '@/types'
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

export function getContentTypes(content: Content[]): string[] {
  return content
    .map((item) => splitMIMEType(item.contentType))
    .filter(([type]) => type && SUPPORTED_MIME_TYPES.includes(type))
    // when the contentType has no ';type=' param, fall back to the MIME type itself
    .map(([type, param]) => param ?? type)
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

export function setNewActiveContentType(contentType: string, index: number, views: PanelView[]) {
  // return a new array with a new object for the matching view, so the updated
  // activeContentType is an actual change (no in-place mutation of the shared views)
  // also adds contentType to the matching view's
  // contentTypes array when it isn't already present
  return views.map((v, i) => {
    if (i !== index) return v

    return { ...v, activeContentType: contentType }
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
