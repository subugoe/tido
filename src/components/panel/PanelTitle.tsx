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
  const manifest = panelState.manifest
  const manifestsLabels = collection?.sequence.map((item) => item.label)
  const updatePanel = usePanelStore(state => state.updatePanel)
  const selectedManifest = useRef(null)

  const [itemsLabels, setItemsLabels] = useState([])
  const [manifestLabel, setManifestLabel] = useState(manifest?.label ?? null)

  function updateSelectedManifest(newManifest: Manifest | null) {
    selectedManifest.current = newManifest
  }

  useEffect(() => {
    async function getItemsLabels() {
      let labels
      if (!collection) return []
      if (selectedManifest.current) {
        labels = selectedManifest.current.sequence.map((item) => item.label) || []
      }
      else {
        labels = manifest.sequence.map((item) => item.label)
      }

      setItemsLabels(labels)
    }
    getItemsLabels()
  }, [collection, manifest, selectedManifest.current])

  useEffect(() => {
    function getManifestLabel() {
      const label = selectedManifest.current ? selectedManifest.current.label : panelState?.manifest?.label ?? null
      setManifestLabel(label)
    }

    getManifestLabel()
  }, [selectedManifest.current, manifest])



  async function updateManifest() {
    const newManifestLabel = selectedManifest.current.label
    const manifestId = collection.sequence.filter((item) => item.label === newManifestLabel)[0].id
    const manifest = await apiRequest<Manifest>(manifestId)
    await updatePanel(panelState.id, { manifest: manifest })
  }

  async function updateItem(newItemLabel: string) {
    const manifest = selectedManifest.current ? selectedManifest.current : panelState.manifest ?? null
    const newItemId = manifest.sequence.filter((item) => item.label === newItemLabel)[0].id
    const newItem = await apiRequest<Item>(newItemId)
    updatePanel(panelState.id, { item: newItem })
    selectedManifest.current = null
  }


  return (
    <>
      <div className="flex items-center">
        { (!panelState || !panelState.item) && <Skeleton className="w-[100px] h-6" />  }
        { panelState && panelState.item  && <ManifestLabel label={manifestLabel} manifestLabels={manifestsLabels} showManifestModal={showManifestModal} setShowManifestModal={setShowManifestModal} updateSelectedManifest={updateSelectedManifest} setIsManifestLabelSelected={setIsManifestLabelSelected} setShowItemModal={setShowItemModal} />}
        <span className="w-[1px] h-[80%] bg-gray-400 mx-2 grow-0 shrink-0"></span>
        { (!panelState || !panelState.item) && <Skeleton className="w-[40px] h-6" />  }
        { panelState && panelState.item && <ItemLabel itemsLabels={itemsLabels} updateManifest={updateManifest} updateItem={updateItem} showItemModal={showItemModal} setShowItemModal={setShowItemModal} isManifestLabelSelected={isManifestLabelSelected} setIsManifestLabelSelected={setIsManifestLabelSelected} />}
      </div>
    </>
  )
}

export default PanelHeader
