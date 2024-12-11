import { request } from "@/utils/http"

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

export function getActiveContentUrl(content: Content[], activeContentTypeIndex: number): string | null {
  if (activeContentTypeIndex < 0 || activeContentTypeIndex >= content.length) return null
  const activeContent: Content | undefined = content[activeContentTypeIndex]
  if (!activeContent) {
    console.error('the current text content was not found')
    return null
  }
  return activeContent.url ?? null
}
