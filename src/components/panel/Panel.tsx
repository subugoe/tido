import { FC, useState, useEffect } from 'react'

import { request } from '@/utils/http'
import { getManifestData, getItemData, isItemContentValid } from '@/utils/panel'
import { contentStore } from '@/store/ContentStore'

import ContentTypesToggle from '@/components/panel/ContentTypesToggle'
import ErrorComponent from '@/components/ErrorComponent'
import PanelCentralContent from '@/components/panel/central-content/PanelCentralContent'
import PanelTopBar from '@/components/panel/PanelTopBar'

interface PanelProps {
  panelConfig: PanelConfig,
  index: number
}

const Panel: FC<PanelProps> = ({ panelConfig, index }) => {
  const openedPanels = contentStore(state => state.openedPanels)
  const initItemData = contentStore(state => state.initItemData)

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

    initItemData(itemData, panelConfig.colors.primary)


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
  }, [panelConfig])


  if (error) {
    return <ErrorComponent message={error} />
  }

  if (loading) {
    return <div> Loading the data of this panel...</div>
  }

  return (
    <div className="panel t-flex t-flex-col t-w-[600px] t-mr-6 t-border-solid t-border-2 t-border-slate-200 t-rounded-lg t-mt-4 t-px-2.5 t-pt-8 t-pb-6">
      <PanelTopBar panelIndex = {index} />
      <div className="t-flex t-flex-col t-items-center t-mb-6">
        <ContentTypesToggle
          panelIndex = {index}
          contentTypes={contentTypes}
        />
      </div>
      <PanelCentralContent textHtml={text}  panelIndex = {index}  />
    </div>
  )
}

export default Panel
