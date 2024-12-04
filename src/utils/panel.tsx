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
