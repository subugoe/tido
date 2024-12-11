import { FC, useState, useEffect } from 'react'
import {useConfig} from '@/contexts/ConfigContext'

import { get, isError } from '@/utils/http'
import { getUrlActiveContentText, getManifestData, getItemData } from '@/utils/panel'


import CustomHTML from '@/components/CustomHTML'
import ContentTypesToggle from '@/components/panel/ContentTypesToggle'
import ErrorComponent from '@/components/ErrorComponent'

interface PanelProps {
  panelConfig: PanelConfig
}

// prop: url - should be the url of collection or manifest
const Panel: FC <PanelProps> = ({ panelConfig }) => {
  const { config } = useConfig()
  const [text, setText] = useState<string>('')

  const [contentTypes, setContentTypes] = useState<string[]>([])
  const [activeContentTypeIndex, setActiveContentTypeIndex] = useState(0)

  const [error, setError] = useState<boolean | string>(false)
  const [loading, setLoading] = useState<boolean>(true)

  let documentType: string



  async function assignContentTypes(itemData: Item) {
    if (!('content' in itemData)) return
    if (itemData.content.length === 0) return

    const content: Content[] = itemData.content
    const types: string[] = content.map((item) => getContentType(item.type))
    setContentTypes(types)
  }

  function getContentType(value: string): string {
    if (!value) return ''
    return value.split('type=')[1]
  }

  function setDocumentType(panelConfig: PanelConfig) {
    try {
      if (!('entrypoint' in panelConfig)) {
        throw Error('Config of this panel needs to have "entrypoint"')
      }
      const entrypointType = panelConfig.entrypoint.type.toLowerCase()

      if (!(entrypointType === 'manifest') 
            && !(entrypointType === 'collection')) {
        throw Error('Entrypoint in the panel config is provided wrong. It should have either a `collection` or `manifest` type')
      }
      if (entrypointType === 'collection') {
        documentType = 'collection'
      }
      if (entrypointType === 'manifest') {
        documentType = 'manifest'
      }
    } catch(e) {
      setError(e.message)
      return
    }
  }


  async function readData(panelConfig: PanelConfig) {
    let documentData: Collection | Manifest
    if (!panelConfig || Object.keys(panelConfig).length === 0) return 

    if (error) return
    let response
    let manifestData: Manifest, itemData: Item
    // read document (collection/manifest) data
    try {
      const documentType = panelConfig.entrypoint.type?.toLowerCase()
      if (!documentType) throw Error('Error: please define the type of document for the entrypoint')
      if (!(documentType === 'collection') && !(documentType === 'manifest')) throw Error('Error: please define document type (`collection` or`manifest`) for the entrypoint')

      // read Document data
      response = await get(panelConfig.entrypoint.url)
      documentData = documentType === 'collection' ? response as Collection : response as Manifest

      // read Manifest data
      response = await getManifestData(documentData, documentType)
      manifestData = response as Manifest

      // read item data
      response = await getItemData(manifestData)
      itemData = response as Item

      await assignContentTypes(itemData)
      const itemHtmlUrl = getUrlActiveContentText(itemData.content, activeContentTypeIndex)

      const textInHtml = await get(itemHtmlUrl)
      setText(textInHtml)
      
      setLoading(false)

    } catch (err) {
        setError(err.message)
        return
    }
  }

  

  useEffect(() => {
    setDocumentType(panelConfig)
    // read Api data from url
    readData(panelConfig)
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
      <CustomHTML textHtml={text} widthText='100%'/>
    </div>
  )
}

export default Panel
