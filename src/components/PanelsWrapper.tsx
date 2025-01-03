import { FC, useEffect, useState } from 'react'
import Panel from '@/components/panel/Panel'
import { useConfig } from '@/contexts/ConfigContext'
import { request } from '@/utils/http'
import { getItemData, getManifestData, isItemContentValid } from '@/utils/panel'

import { contentStore } from '@/store/ContentStore'


const PanelsWrapper: FC = () => {
  const { config } = useConfig()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<boolean | string>(false)

  const initItemData = contentStore(state => state.initItemData)
  const contentOpenedPanels = contentStore(state => state.openedPanels)

  const panels = config?.panels

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

  async function readData(panelConfig: PanelConfig, documentType: string | null) {
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

    return itemData    
  }

  function getContentType(value: string): string {
    const type = value.split('type=')[1]
    return type ?? 'missing'
    // when no string stays after type=, then the value is missing
  }

  
  function getContentTypes(content: Content[]): string[] {
    const types: string[] = content.map((item) => {
      if ('type' in item) return getContentType(item.type)
      return 'missing'
    })

    return types
  }

  useEffect(() => {

   

    async function initData(panels: PanelConfig[] | undefined) {
      if (!panels || panels.length === 0) return
      
      for (let i = 0; i < panels.length; i++) { 
        const documentType = getDocumentType(panels[i])

        const itemData = await readData(panels[i], documentType) 

        if (!itemData) continue

        const contentTypes: string[] = getContentTypes(itemData.content)
        
        initItemData({
          item: itemData,
          t:0, 
          v:0,
          contentTypes: contentTypes,
          primaryColor: panels[i].colors.primary
        })
      }
      
      setLoading(false)
    }

    initData(panels)
  }, [])
  
  let openedPanels = <div> Loading data ... Please wait a sec</div>

  
  if (!loading) {
    openedPanels = panels ?
    panels.length > 0 &&
    panels.map((_, i: number) => (
        <Panel  index={i} key={i}/>
    )): <div> loading data...</div>
  }
  
  return <div className="t-flex t-flex-row t-ml-[6%]">{openedPanels}</div>
}

export default PanelsWrapper
