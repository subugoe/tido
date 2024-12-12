import { request } from '@/utils/http'

// get the url of the document (collection or manifest) which will be shown in the panel
export function getManifestUrl(documentData: Manifest | Collection, documentType: string): string {
  let manifestUrl: string = ''
  if (documentType === 'collection') {
    manifestUrl =  documentData?.sequence[0].id
  }
  else if (documentType === 'manifest') {
    manifestUrl = documentData?.id
  }

  return manifestUrl
}

export async function getManifestData(documentData: Collection | Manifest, documentType: string): Promise<HttpResponse<Manifest>> {
  const manifestUrl = getManifestUrl(documentData, documentType)
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