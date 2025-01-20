import { FC, useEffect, useState } from 'react'

import ContentTypesToggle from '@/components/panel/ContentTypesToggle'
import PanelCentralContent from '@/components/panel/views/PanelCentralContent'
import PanelTopBar from '@/components/panel/PanelTopBar'

import ErrorComponent from '@/components/ErrorComponent'
import { PanelProvider } from '@/contexts/PanelContext.tsx'
import { dataStore } from '@/store/DataStore.tsx'
import { apiRequest } from '@/utils/api.ts'
import { contentStore } from '@/store/ContentStore.tsx'
import { getContentTypes } from '@/utils/panel.ts'

interface Props {
  config: PanelConfig
}

const Panel: FC<Props> = ({ config }) => {
  const initCollection = dataStore(state => state.initCollection)
  const addPanelContent = contentStore((state) => state.addPanelContent)

  const [error, setError] = useState<boolean | string>(false)
  const [loading, setLoading] = useState(true)
  const [panelId, setPanelId] = useState<string | undefined>(undefined)

  useEffect(() => {
    const panelId = crypto.randomUUID()
    const collectionUrl = config.entrypoint.url
    const init = async () => {
      try {
        setLoading(true)
        const collection = await initCollection(collectionUrl)
        const manifest = await apiRequest<Manifest>(collection.sequence[config.manifestIndex ?? 0].id)
        const item = await apiRequest<Item>(manifest.sequence[config.itemIndex ?? 0].id)
        const contentTypes: string[] = getContentTypes(item.content)

        addPanelContent(panelId, {
          item,
          contentIndex: 0,
          viewIndex: 0,
          contentTypes,
          primaryColor: 'blue',
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

  if (error) {
    return <ErrorComponent message={error} />
  }

  return (
    <div
      className="panel t-flex t-flex-col t-w-[600px] t-mr-6 t-border-solid t-border-2 t-border-slate-200 t-rounded-lg t-mt-4 t-px-2.5 t-pt-8 t-pb-6">
      { loading && <div> Loading data ... Please wait a sec</div> }
      { !loading && error && <ErrorComponent message={error} /> }
      { !loading && !error && panelId &&
        <PanelProvider id={panelId}>
          <PanelTopBar/>
          <div className="t-flex t-flex-col t-items-center t-mb-6">
            <ContentTypesToggle/>
          </div>
          <PanelCentralContent/>
        </PanelProvider>
      }
    </div>
  )
}

export default Panel
