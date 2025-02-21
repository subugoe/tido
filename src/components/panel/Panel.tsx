import { FC, useEffect, useState } from 'react'

import PanelCentralContent from '@/components/panel/views/PanelCentralContent'
import PanelHeader from '@/components/panel/PanelHeader.tsx'

import ErrorComponent from '@/components/ErrorComponent'
import { PanelProvider } from '@/contexts/PanelContext.tsx'
import { dataStore } from '@/store/DataStore.tsx'
import { apiRequest } from '@/utils/api.ts'
import { panelStore } from '@/store/PanelStore.tsx'
import { getContentTypes, isNewManifest } from '@/utils/panel.ts'
import { scrollStore } from '@/store/ScrollStore.tsx'
import ScrollPanelMenu from '@/components/panel/ScrollPanelMenu.tsx'

import { getSupport } from '@/utils/support-styling.ts'

interface Props {
  config: PanelConfig
}

const Panel: FC<Props> = ({ config }) => {
  const getCollection = dataStore(state => state.getCollection)
  const addPanelContent = panelStore((state) => state.addPanelContent)
  const scrollPanelIds = scrollStore(state => state.panelIds)

  const [error, setError] = useState<boolean | string>(false)
  const [loading, setLoading] = useState(false)
  const [panelId, setPanelId] = useState<string | undefined>(undefined)
  const [isScrollPanel, setIsScrollPanel] = useState(false)
  useEffect(() => {
    const panelId = crypto.randomUUID()
    const collectionUrl = config.entrypoint.url
    const init = async () => {
      try {
        setLoading(true)
        const collection = await getCollection(collectionUrl)

        const manifest = await apiRequest<Manifest>(collection.sequence[config.manifestIndex ?? 0].id)
        const item = await apiRequest<Item>(manifest.sequence[config.itemIndex ?? 0].id)
        const contentTypes: string[] = getContentTypes(item.content)

        const { support } = manifest

        if (support && support.length > 0 && isNewManifest(manifest)) {
          // Support can be loaded for a new manifest
          await getSupport(support)
        }

        addPanelContent({
          id: panelId,
          collectionId: collection.id,
          manifest,
          item,
          contentIndex: 0,
          viewIndex: 0,
          contentTypes,
          activeTargetIndex: -1
        })
        setPanelId(panelId)
      } catch (e) {
        setError((e as ErrorResponse).message)
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [config])

  useEffect(() => {
    setIsScrollPanel(panelId ? scrollPanelIds.includes(panelId) : false)
  }, [scrollPanelIds, panelId])

  if (error) {
    return <ErrorComponent message={error} />
  }

  return (
    <div
      className={
        `panel t-relative t-flex t-flex-col t-w-[600px] t-border-solid t-border-2 t-rounded-lg t-p-2
        ${isScrollPanel ? 't-border-amber-300 t-ring-4 t-ring-amber-50' : 't-border-slate-200' }
      `}
    >
      { loading && <div> Loading data ... Please wait a sec</div> }
      { !loading && error && <ErrorComponent message={error} /> }
      { !loading && !error && panelId &&
        <PanelProvider id={panelId}>
          {isScrollPanel && <ScrollPanelMenu className="t-absolute t-top-0 t-left-1/2 -t-translate-x-1/2" /> }
          <PanelHeader />
          <PanelCentralContent />
        </PanelProvider>
      }
    </div>
  )
}

export default Panel
