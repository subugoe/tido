import { FC, useState, useRef, useEffect } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import MetadataItem from '@/components/metadata/MetadataItem.tsx'
import { useTranslation } from 'react-i18next'

import { getCollectorsName, getCollectionMetadata } from '@/utils/metadata.ts'

const CollectionMetadata: FC = () => {
  const { panelState } = usePanel()
  const { t } = useTranslation()
  const [showMetadata, setShowMetadata] = useState(false)
  const [height, setHeight] = useState('0px') // Store the height of the content
  const contentRef = useRef(null)

  const collection = useDataStore(
    (state) => panelState && panelState.collectionId ? state.collections[panelState.collectionId].collection : null
  )

  const collectorsName: string | null = getCollectorsName(collection)
  const  description = collection?.description
  const collectionTitle: Title[] = collection?.title ?? []

  const metadata = getCollectionMetadata(collectionTitle, collectorsName, description)

  useEffect(() => {
    // Function to update the height dynamically based on content
    if (!contentRef.current) return
    const fullHeight = `${contentRef.current.scrollHeight}px`

    // Open the div by setting height to the full height of the content
    if (showMetadata) {
      // To trigger a smooth transition, first collapse the div, then expand it
      setHeight('0px')

      // Trigger a reflow to ensure the browser recognizes the collapse
      setTimeout(() => {
        setHeight(fullHeight) // Now expand the div after a brief delay
      }, 0)  // The delay of 0ms is enough for the reflow to occur
    } else {
      // Collapse the div by setting height to 0px
      setHeight('0px')
    }
  }, [showMetadata]) // Runs every time the isOpen state changes


  return <div>
    <a title={t('please_click_to_view_metadata')} className="t-h-10 t-text-xl t-text-zinc-800  t-w-1/2 t-outline-none hover:t-bg-gray-200 hover:t-cursor-pointer hover:t-p-[2px]"
      onClick={() => setShowMetadata(!showMetadata)}>
      { t('collection') }
    </a>

    { showMetadata && <div
      ref={contentRef} className={'collection-metadata t-ml-4 t-mt-1 t-transition-all t-ease-in-out'}
      style={{
        height: height,
      }}
    >
      {
        metadata.map((meta, i) => <MetadataItem item={meta} key={i} />)
      }
    </div>
    }

  </div>
}

export default CollectionMetadata
