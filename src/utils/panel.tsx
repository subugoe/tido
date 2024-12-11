import { get } from "@/utils/http"

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

export async function getManifestData(documentData: Collection | Manifest, documentType: string): Promise<Manifest> {
  
  const manifestUrl = getManifestUrl(documentData, documentType)
  try {
    const data = await get(manifestUrl)
    return data
  } 
  catch(err) { 
      throw err
  }
}


export async function getItemData(manifestData: Manifest): Promise<Item> {
  try {
    if (!manifestData.sequence || manifestData.sequence.length === 0) {
      throw Error ('The items of manifest '+ manifestData.label??+ 'are not defined or are empty!!')
    }
     const itemUrl = manifestData?.sequence[0].id
     const response = await get(itemUrl)
     return response
  } catch (err) {
    throw err
  }
}

export function getCollectionUrl(panel: PanelConfig): string | null {
  return panel.collection ?? null
}



export function getUrlActiveContentText(content: Content[], activeContentTypeIndex: number): string | null {
  if (activeContentTypeIndex < 0 || activeContentTypeIndex >= content.length) return null
  const activeContent: Content | undefined = content[activeContentTypeIndex]
  if (!activeContent) {
    console.error('the current text content was not found')
    return null
  }
  return activeContent.url ? activeContent.url : null
}