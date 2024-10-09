

export function orderMetadataItems(orderConfig, defaultMetadata) {
      // orderConfig: metadata keys given in an array in the desired order
            // example: ['collector', 'title', 'collection'] -> the keys of the metadata items to be shown according to this order 
    // defaultMetadata: the created metadata array according to a specified order

    let orderedMetadata = []
    if(orderConfig?.length) {
        orderConfig.forEach((key) => {
            const metadataItem = defaultMetadata.find((metadata) => metadata.key === key)
            if(metadataItem) orderedMetadata.push({'key': key, 'value': metadataItem.value})
        })
    }
    return orderedMetadata
}
