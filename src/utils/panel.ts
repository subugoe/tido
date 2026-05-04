import { request } from '@/utils/http'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { PanelConfig, PanelView } from '@/types'
import { useUIStore } from '@/store/UIStore.tsx'
import { SUPPORTED_MIME_TYPES } from './constants'

// get the url of the document (collection or manifest) which will be shown in the panel
export function getManifestUrl(documentData: Manifest | Collection, documentType: string, index: number): string {
  let manifestUrl = ''
  if (documentType === 'collection') {
    manifestUrl = (documentData as Collection).manifests[index]
  }
  else if (documentType === 'manifest') {
    manifestUrl = documentData?.id
  }

  return manifestUrl
}

export async function getManifestData(documentData: Collection | Manifest, documentType: string, index: number): Promise<HttpResponse<Manifest>> {
  const manifestUrl = getManifestUrl(documentData, documentType, index)
  return await request<Manifest>(manifestUrl)
}

export async function getItemData(manifestData: Manifest): Promise<HttpResponse<Item>> {
  const itemUrl = manifestData?.items?.[0]
  if (!itemUrl) throw new Error('No items found')
  return await request<Item>(itemUrl)
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
    .map(([,param]) => param)
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

export function validateImage(item: Item) {
  return !!item?.images?.[0]?.id
}

export function setNewActiveContentType(contentType: string, index: number, views: PanelView[]) {
  return views.map((v, i) => {
    if (i === index) v.activeContentType = contentType
    return v
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
