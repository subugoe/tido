import { readApi } from '@/utils/http'

// get the url of the document (collection or manifest) which will be shown in the panel
export function getManifestUrl(panel: Panel): string | null {
  return panel.manifest ?? null
}

export function getCollectionUrl(panel: Panel): string | null {
  return panel.collection ?? null
}

export function getPanel(url: string | undefined | null, config: Config | undefined): Panel | undefined {
  if (!config) throw new Error('Config is not defined')
  if (!url) throw new Error('url is undefined or null')
  return config.panels.find((panel) => {
    if ('collection' in panel) return panel.collection === url
    if ('manifest' in panel) return panel.manifest === url
  })
}


export async function readHtml(url: string | undefined): Promise<string> {
  // url: the url of html file of the item
  if (!url) {
    console.error('url of the html content text file is undefined!!')
    return ''
  }
  const data = await fetch(url);
  const text = await data.text();

  return text;
}


export function getUrlActiveText(content: Content[], activeContentType: string): string | undefined {
  const activeContent: Content | undefined = content.find((item) => item.type.includes(activeContentType))
  if (!activeContent) {
    console.error('the current text content was not found')
    return undefined
  }
  return activeContent.url ? activeContent.url : undefined
}