import { request } from '@/utils/http'
import { usePanelStore } from '@/store/PanelStore.tsx'

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

export function splitMIMEType(value: string): string[] {
  return value.split(';type=')
}

export const SUPPORTED_MIME_TYPES = [
  'text/html',
  'text/plain',
  'text/xml',
  'application/xhtml+xml'
]

export function getContentTypes(content: Content[]): string[] {
  return content
    .map((item) => splitMIMEType(item.type))
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
