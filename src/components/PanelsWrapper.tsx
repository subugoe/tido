import { FC, useEffect, useRef, useState } from 'react'

import { contentStore } from '@/store/ContentStore'
import { PanelProvider } from '@/contexts/PanelContext'

import Panel from '@/components/panel/Panel'

import { request } from '@/utils/http'
import {
  getItemData,
  getManifestData,
  isItemContentValid,
  getContentTypes,
} from '@/utils/panel'
import ErrorComponent from '@/components/ErrorComponent'
import { configStore } from '@/store/ConfigStore.tsx'

const PanelsWrapper: FC = () => {
  const config = configStore(state => state.config)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<boolean | string>(false)
  const panelIds = useRef<string[]>([])

  const addPanelContent = contentStore((state) => state.addPanelContent)
  const addManifestLabel = contentStore((state) => state.addManifestLabel)

  const panels = config?.panels

  function getDocumentType(panelConfig: PanelConfig): string | null {
    if (!('entrypoint' in panelConfig)) {
      setError('Config of this panel needs to have "entrypoint"')
      return null
    }
    const entrypointType = panelConfig.entrypoint.type.toLowerCase()

    if (
      !(entrypointType === 'manifest') &&
      !(entrypointType === 'collection')
    ) {
      setError(
        'Entrypoint in the panel config is provided wrong. It should have either a `collection` or `manifest` type'
      )
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

    let response

    // read Document data
    response = await request(panelConfig.entrypoint.url)

    if (!response.success) {
      setError(response.message)
      return
    }

    const documentData =
      documentType === 'collection'
        ? (response.data as Collection)
        : (response.data as Manifest)

    // read Manifest data
    response = await getManifestData(documentData, documentType)
    if (!response.success) {
      setError(response.message)
      return
    }

    const manifestData = response.data as Manifest
    const manifestLabel = manifestData.label

    // read item data
    if (!manifestData.sequence || manifestData.sequence.length === 0) {
      setError(
        'The items of manifest ' +
          (manifestData.label ?? 'unknown') +
          ' are not defined or are empty!!'
      )
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

    return {item: itemData, manifestLabel: manifestLabel}
  }

  useEffect(() => {
    async function initData(panels: PanelConfig[]) {
      for (let i = 0; i < panels.length; i++) {
        const documentType = getDocumentType(panels[i])
        if (!documentType) {
          setError('The document type for this entrypoint url is not valid')
          continue
        }

        const data = await readData(panels[i], documentType)
        if (!data) continue

        const { item, manifestLabel } = data

        const contentTypes: string[] = getContentTypes(item.content)
        // unique id of PanelContent object
        const panelId = crypto.randomUUID()
        panelIds.current.push(panelId)

        addPanelContent(panelId, {
          item: item,
          contentIndex: 0,
          viewIndex: 0,
          contentTypes: contentTypes,
          manifestLabel: manifestLabel
        })

        addManifestLabel(manifestLabel)
      }

      setLoading(false)
    }

    if (!panels || panels.length === 0) return

    initData(panels)
  }, [])

  const loadingEl = <div> Loading data ... Please wait a sec</div>
  let openedPanels = null

  if (error) return <ErrorComponent message={error} />

  if (!loading && panels) {
    openedPanels = panelIds.current.map((panelId, i: number) => (
      <PanelProvider id={panelId} key={i}>
        <Panel />
      </PanelProvider>
    ))
  }

  if (loading) return loadingEl

  return <div className="t-flex t-flex-row t-ml-[6%]"> {openedPanels}</div>
}

export default PanelsWrapper
