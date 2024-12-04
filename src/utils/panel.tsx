// get the url of the document (collection or manifest) which will be shown in the panel
export function getPanelUrl(panel: Panel) {
  if (!('collection' in panel) && !('manifest' in panel)) {
    console.error('manifest or collection not defined in panel');
  }
  if ('collection' in panel) return panel.collection;
  if ('manifest' in panel) return panel.manifest;
}

export function getPanel(url: string, config: Config | undefined): Panel | undefined {
  if (!config) throw new Error('Config is not defined')

  return config.panels.find((panel) => {
    if ('collection' in panel) return panel.collection === url
    if ('manifest' in panel) return panel.manifest === url
  })
}
