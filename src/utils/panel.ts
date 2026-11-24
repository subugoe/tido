import { usePanelStore } from '@/store/PanelStore.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { PanelConfig, PanelView } from '@/types'
import { useUIStore } from '@/store/UIStore.tsx'

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

// Opens a panel on the given item - with its own views when given, else with the global panelViews
export async function createNewPanel(
  collectionId: string,
  manifest: Manifest,
  item: Item,
  newPanelId: string,
  { showSidebar, views }: { showSidebar?: boolean, views?: PanelView[] } = {},
) {
  const newPanelConfig : PanelConfig = {
    collection: collectionId,
    manifest: manifest.id,
    item: item.id,
    ...(views && { views }),
    showSidebar: showSidebar ?? false,
  }

  useUIStore.getState().updateNewestPanelId(newPanelId)
  await usePanelStore.getState().addPanel(newPanelConfig, newPanelId)
}
