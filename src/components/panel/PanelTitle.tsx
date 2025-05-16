import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

import { useDataStore } from '@/store/DataStore.tsx'
import { apiRequest } from '@/utils/api.ts'
import { usePanelStore } from '@/store/PanelStore.tsx'
import ItemLabel from '@/components/panel/ItemLabel.tsx'
import ManifestLabel from '@/components/panel/ManifestLabel.tsx'

const PanelHeader: FC = () => {
  const { panelState } = usePanel()

  const [showManifestModal, setShowManifestModal] = useState(false)
  const [showItemModal, setShowItemModal] = useState(false)

  const collection = useDataStore().collections[panelState.collectionId]?.collection
  const manifestsLabels = collection?.sequence.map((item) => item.label)
  const itemsLabels = panelState?.manifest?.sequence.map((item) => item.label)
  const updatePanel = usePanelStore(state => state.updatePanel)


  function getManifestLabel() {
    return panelState?.manifest?.label ?? null
  }

  async function handleManifestClick(newManifestLabel: string) {
    setShowManifestModal(false)
    setShowItemModal(true)
    const manifestId = collection.sequence.filter((item) => item.label === newManifestLabel)[0].id
    const manifest = await apiRequest<Manifest>(manifestId)
    updatePanel(panelState.id, { manifest: manifest })
  }

  async function updateItem(newItemLabel: string) {
    const newItemId = panelState.manifest.sequence.filter((item) => item.label === newItemLabel)[0].id
    const newItem = await apiRequest<Item>(newItemId)
    updatePanel(panelState.id, { item: newItem })
  }

  return (
    <>
      <div className="flex items-center">
        { (!panelState || !panelState.item) && <Skeleton className="w-[100px] h-6" />  }
        { panelState && panelState.item  && <ManifestLabel label={getManifestLabel()} manifestLabels={manifestsLabels} handleManifestClick={handleManifestClick} showManifestModal={showManifestModal} setShowManifestModal={setShowManifestModal} />}
        <span className="w-[1px] h-[80%] bg-gray-400 mx-2 grow-0 shrink-0"></span>
        { (!panelState || !panelState.item) && <Skeleton className="w-[40px] h-6" />  }
        { panelState && panelState.item && <ItemLabel itemLabels={itemsLabels} updateItem={updateItem} showItemModal={showItemModal} setShowItemModal={setShowItemModal} />}
      </div>
    </>
  )
}

export default PanelHeader
