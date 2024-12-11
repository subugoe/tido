import { FC, useState, useEffect } from 'react'
import {useConfig} from '@/contexts/ConfigContext'

import { get, isError } from '@/utils/http'
import {  readHtml, getUrlActiveContentText, getManifestUrl } from '@/utils/panel'


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


  function getItemUrl(manifestData: Manifest, itemIndex: number): string | null {
    return manifestData.sequence[itemIndex].id
  }

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
    let itemUrl, manifestData: Manifest, itemData: Item,manifestUrl
    // read document (collection/manifest) data
    try {
      const documentType = panelConfig.entrypoint.type?.toLowerCase()
      console.log('document type', documentType)
      if (!documentType) throw Error('Error: please define the type of document for the entrypoint')
      if (!(documentType === 'collection') && !(documentType === 'manifest')) throw Error('Error: please define document type (`collection` or`manifest`) for the entrypoint')
      console.log('just before getting response')
      response = await get(panelConfig.entrypoint.url)
      documentData = documentType === 'collection' ? response as Collection : response as Manifest
      const manifestUrl = getManifestUrl(documentData, documentType)
      
      // read manifest data
      response = await get(manifestUrl)
      manifestData = response as Manifest

    } catch (err) {
        console.log('catching error message', err.message)
        setError(err.message)
        return
    }
    
    

    /*
    

    itemUrl = getItemUrl(manifestData, panelConfig.i)
    if (!itemUrl) return

    // read Item data
    try {
      response = await get(itemUrl)
    } catch(err) {
        setError(err.message)
        return
     }

    itemData = response

    await assignContentTypes(itemData)
    const itemHtmlUrl = getUrlActiveContentText(itemData.content, activeContentTypeIndex)

    const textInHtml = await readHtml(itemHtmlUrl)
    setText(textInHtml)
    */
    setLoading(false)
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
