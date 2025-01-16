export function orderMetadataItems(orderConfig, defaultMetadata) {
  // orderConfig: metadata keys given by "User" in an array in the desired order for a certain documentType
  // defaultMetadata: the created metadata array according to a "TIDO" specified order

  let orderedMetadata = []
  if (orderConfig?.length) {
    orderConfig.forEach((key) => {
      const metadataItem = defaultMetadata.find(
        (metadata) => metadata.key.toLowerCase() === key.toLowerCase()
      )
      if (metadataItem)
        orderedMetadata.push({ key: key, value: metadataItem.value })
    })
  }
  return orderedMetadata
}

export function getMetadataView(panels) {
  let metadataView
  for (let i = 0; i < panels.length; i++) {
    const panel = panels[i]
    const viewsPanel = panel.views

    if (!viewsPanel || viewsPanel.length === 0) continue

    metadataView = viewsPanel.filter((view) => view.connector.id === 2)

    if (metadataView.length > 0) return metadataView[0]
  }

  return null
}
