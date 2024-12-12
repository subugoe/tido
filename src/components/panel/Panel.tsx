import { FC, useState, useEffect } from 'react'

import { request } from '@/utils/http'
import { getManifestData, getItemData, isItemContentValid } from '@/utils/panel'


import CustomHTML from '@/components/CustomHTML'
import ContentTypesToggle from '@/components/panel/ContentTypesToggle'
import ErrorComponent from '@/components/ErrorComponent'

interface PanelProps {
  panelConfig: PanelConfig
}

// prop: url - should be the url of collection or manifest
const Panel: FC<PanelProps> = ({ panelConfig }) => {
  const [text, setText] = useState<string>('')

  const [contentTypes, setContentTypes] = useState<string[]>([])
  const [activeContentTypeIndex, setActiveContentTypeIndex] = useState(0)

  const [error, setError] = useState<boolean | string>(false)
  const [loading, setLoading] = useState<boolean>(true)

  async function assignContentTypes(content: Content[]) {
    const types: string[] = content.map((item) => {
      if ('type' in item) return getContentType(item.type)
      return 'missing'
    })

    setContentTypes(types)
  }

  function getContentType(value: string): string {
    const type = value.split('type=')[1]
    return type ?? 'missing'
    // when no string stays after type=, then the value is missing
  }


  function getDocumentType(panelConfig: PanelConfig): string | null {
    if (!('entrypoint' in panelConfig)) {
      setError('Config of this panel needs to have "entrypoint"')
      return null
    }
    const entrypointType = panelConfig.entrypoint.type.toLowerCase()

    if (!(entrypointType === 'manifest') && !(entrypointType === 'collection')) {
      setError('Entrypoint in the panel config is provided wrong. It should have either a `collection` or `manifest` type')
      return null
    }

    if (entrypointType === 'collection') {
      return 'collection'
    }
    if (entrypointType === 'manifest') {
      return 'manifest'
    }

    return null
  }


  async function readData(panelConfig: PanelConfig, documentType: string) {
    if (!panelConfig || Object.keys(panelConfig).length === 0) return

    if (error) return
    let response

    // read Document data
    response = await request(panelConfig.entrypoint.url)

    if (!response.success) {
      setError(response.message)
      return
    }

    const documentData = documentType === 'collection' ? response.data as Collection : response.data as Manifest

    // read Manifest data
    response = await getManifestData(documentData, documentType)
    if (!response.success) {
      setError(response.message)
      return
    }

    const manifestData = response.data as Manifest

    // read item data
    if (!manifestData.sequence || manifestData.sequence.length === 0) {
      setError ('The items of manifest ' + (manifestData.label ?? 'unknown') + ' are not defined or are empty!!')
      return
    }

    response = await getItemData(manifestData)
    if (!response.success) {
      setError(response.message)
      return
    }

    const itemData = response.data as Item

    if (!isItemContentValid(itemData)) {
      setError('Content objects are not defined for this item')
      return
    }

    await assignContentTypes(itemData.content)
    const contentUrl = itemData.content[activeContentTypeIndex]?.url ?? null

    if (!contentUrl) {
      setError('No content URL found.')
      return
    }
    response = await request<string>(contentUrl)

    if (!response.success) {
      setError(response.message)
      return
    }

    setText(response.data)

    setLoading(false)
  }

  useEffect(() => {
    const documentType = getDocumentType(panelConfig)
    if (!documentType) return

    readData(panelConfig, documentType)
  }, [panelConfig, activeContentTypeIndex])


  if (error) {
    return <ErrorComponent message={error} />
  }

  if (loading) {
    return <div> Loading the data of this panel...</div>
  }

  return (
    <div className="panel t-flex t-flex-col t-w-[600px] t-ml-[6%] t-border-solid t-border-2 t-border-slate-200 t-rounded-lg t-mt-4 t-px-2.5 t-pt-8 t-pb-6">
      <div className="t-flex t-flex-col t-items-center t-mb-6">
        <ContentTypesToggle
          contentTypes={contentTypes}
          activeContentTypeIndex={activeContentTypeIndex}
          setActiveContentTypeIndex={setActiveContentTypeIndex}
        />
      </div>
      <CustomHTML textHtml={text} />
    </div>
  )
}

export default Panel
