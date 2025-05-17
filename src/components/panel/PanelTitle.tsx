import { FC, useEffect, useRef, useState } from 'react'
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
  const [isManifestLabelSelected, setIsManifestLabelSelected] = useState(false)

  const collection = useDataStore().collections[panelState.collectionId]?.collection
  const manifestsLabels = collection?.sequence.map((item) => item.label)
  const updatePanel = usePanelStore(state => state.updatePanel)
  const selectedManifestLabel = useRef(null)
  const selectedManifest = useRef(null)
  const [itemsLabels, setItemsLabels] = useState([])



  useEffect(() => {
    async function getItemsLabels() {
      let labels
      if (!collection) return []

      if (!selectedManifestLabel.current) {
        labels = panelState.manifest.sequence.map((item) => item.label)
      }
      else {
        const manifestId = collection?.sequence.find((manifest) => manifest.label === selectedManifestLabel.current).id
        const manifest = await apiRequest<Manifest>(manifestId)
        labels =  manifest.sequence.map((item) => item.label) || []
        selectedManifest.current = manifest
      }
      setItemsLabels(labels)
    }
    getItemsLabels()
  }, [collection, selectedManifestLabel.current])


  function getManifestLabel() {
    if (selectedManifest.current) return selectedManifest.current.label
    return panelState?.manifest?.label ?? null
  }

  async function handleManifestClick(newManifestLabel: string) {
    setShowManifestModal(false)
    setShowItemModal(true)
    setIsManifestLabelSelected(true)
    selectedManifestLabel.current = newManifestLabel
  }

  async function updateManifest() {
    const newManifestLabel = selectedManifestLabel.current
    const manifestId = collection.sequence.filter((item) => item.label === newManifestLabel)[0].id
    const manifest = await apiRequest<Manifest>(manifestId)
    await updatePanel(panelState.id, { manifest: manifest })
  }

  async function updateItem(newItemLabel: string) {
    const manifest = selectedManifest.current ? selectedManifest.current : panelState.manifest ?? null
    const newItemId = manifest.sequence.filter((item) => item.label === newItemLabel)[0].id
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
        { panelState && panelState.item && <ItemLabel itemsLabels={itemsLabels} updateManifest={updateManifest} updateItem={updateItem} showItemModal={showItemModal} setShowItemModal={setShowItemModal} isManifestLabelSelected={isManifestLabelSelected} setIsManifestLabelSelected={setIsManifestLabelSelected} />}
      </div>
    </>
  )
}

export default PanelHeader
