import { request } from '@/utils/http'
import { panelStore } from '@/store/PanelStore.tsx'

// get the url of the document (collection or manifest) which will be shown in the panel
export function getManifestUrl(documentData: Manifest | Collection, documentType: string, index: number): string {
  let manifestUrl: string = ''
  if (documentType === 'collection') {
    manifestUrl = documentData?.sequence[index].id
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
  const itemUrl = manifestData?.sequence[0].id
  return await request<Item>(itemUrl)
}


export function isItemContentValid(itemData: Item): boolean {
  if (!('content' in itemData)) return false
  if (itemData.content.length === 0) return false
  return true
}

export function getContentType(value: string): string {
  let type = value.split('type=')[1]
  type = type.charAt(0).toUpperCase() + type.slice(1) // convert the first letter to upper case
  return type ?? 'missing'
  // when no string stays after type=, then the value is missing
}


export function getContentTypes(content: Content[]): string[] {
  const types: string[] = content.map((item) => {
    if ('type' in item) return getContentType(item.type)
    return 'missing'
  })

  return types
}

export function getUniquePanels(panels: PanelConfig[] | undefined) {
  if (!panels) return []

  const uniquePanels = panels.filter((p, index, self) =>
    index === self.findIndex((panel) => panel.entrypoint.url === p.entrypoint.url))

  return uniquePanels
}

export function isNewManifest(manifest: Manifest): boolean {
  const panels = panelStore.getState().panels

  for (const key in panels) {
    if (manifest.id === panels[key].manifest.id) return false
  }

  return true
}
