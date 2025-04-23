
function getCollectionMetadata (collectionTitle: Title[] | undefined, collectorsName: Actor[] | undefined, description: string | undefined) {
  const mappings = {
    main: 'title',
    sub: 'subtitle',
  }

  const { result: collTitle, errors: titleErrors } = validateTitle(collectionTitle)
  const { result: collectors } = validateCollectorsName(collectorsName)


  return [
    ...(Object.keys(titleErrors).length === 0 && collTitle.map((title) => ({
      key: mappings[title.type] || 'title',
      value: title.title,
    })) || [{ key: 'title', value: titleErrors[Object.keys(titleErrors)[0]] }]),
    ...([{ key: 'collector', value: collectors }]),
    ...(description ? [{ key: 'description', value: description }] : []),
  ]
}

function getManifestMetadata(manifest: Manifest | null) {
  const { result, errors } = validateLicense(manifest?.license)

  return [
    { key: 'label', value: manifest?.label },
    ...(result || []).map((license) => ({
      key: 'license',
      value: license.id,
    })), { key: 'license', value: errors[Object.keys(errors)[0]] },
    ...(manifest?.metadata || [])
  ]
}

function validateCollectorsName(input: Actor[] | undefined) {
  const result =
    Array.isArray(input) && input.length > 0
      ? input.length === 1 ? input[0].name : input.map((collector) => collector.name).join(', ')
      : (() => {
        return 'value_must_be_an_array'
      })()
  return { result }
}

function validateLicense(input: License[] | undefined) {
  const errors: Record<string, string>  = { }
  const result =
    Array.isArray(input)
      ? input
      : (() => {
        if (input !== undefined)
          errors['license'] = 'license_must_be_an_array'
        return []
      })()
  return { result, errors }
}

function validateTitle(input: Title[] | undefined) {
  const errors: Record<string, string>  = { }
  const result =
    Array.isArray(input)
      ? input
      : (() => {
        if (input !== undefined)
          errors['title'] = 'value_must_be_an_array'
        return []
      })()
  return { result, errors }
}


function getItemMetadata(item: Item | null) {
  return [
    { key: 'label', value: item?.n },
    { key: 'language', value: item?.lang?.join(',') },
    { key: 'image_license', value: item?.image?.license?.id },
    { key: 'image_notes', value: item?.image?.license?.notes },
  ].filter(i => i.value)
}

export { getCollectionMetadata, getManifestMetadata, getItemMetadata, validateCollectorsName }
