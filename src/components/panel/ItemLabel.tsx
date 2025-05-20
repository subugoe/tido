import { FC, useEffect, useRef, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { apiRequest } from '@/utils/api.ts'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { useConfigStore } from '@/store/ConfigStore.tsx'

interface ItemLabelProps {
  selectedManifest: Manifest | null
  updateSelectedManifest: (newManifest: Manifest | null) => void,
  showItemModal: boolean,
  setShowItemModal: (show: boolean) => void,
}

const ItemLabel: FC<ItemLabelProps> = ({ selectedManifest, updateSelectedManifest, showItemModal, setShowItemModal }) => {
  const { panelState } = usePanel()
  const primaryColor = useConfigStore().config.theme.primaryColor
  const collection = useDataStore().collections[panelState.collectionId]?.collection
  const manifest = panelState.manifest
  const updatePanel = usePanelStore(state => state.updatePanel)

  const [labels, setLabels] = useState([])
  const externallyOpened = useRef(false)


  useEffect(() => {
    async function getLabels() {
      let labels
      if (!collection) return []
      if (selectedManifest) {
        labels = selectedManifest.sequence.map((item) => item.label) || []
      }
      else {
        labels = manifest.sequence.map((item) => item.label)
      }

      setLabels(labels)
    }
    getLabels()
  }, [collection, manifest, selectedManifest])


  const handleOpenChange = (open: boolean) => {
    // following if is used to prevent the natural close (not allowing setShowItemModal(open) to execute) of itemModal when we select a manifest label in modal. Without this if statement, the item modal opens and closes immediately, which is not what we want.
    if (!open && externallyOpened.current) {
      externallyOpened.current = false
      return
    }

    updateSelectedManifest(null)
    setShowItemModal(open)
  }

  async function getItem(newItemLabel: string, manifest: Manifest) {
    const newItemId = manifest.sequence.filter((item) => item.label === newItemLabel)[0].id
    return await apiRequest<Item>(newItemId)
  }

  async function handleItemClick(newItemLabel: string) {
    const manifest = selectedManifest ? selectedManifest : panelState.manifest ?? null
    const manifestIndex = collection.sequence.findIndex((item) => item.id === manifest.id)
    const newItem = await getItem(newItemLabel, manifest)
    const itemIndex = manifest.sequence.findIndex((item) => item.id === newItem.id)

    updatePanel(panelState.id, {
      manifest: manifest,
      item: newItem,
      config: { ...panelState.config, manifestIndex: manifestIndex, itemIndex: itemIndex }
    })

    setShowItemModal(false)
    updateSelectedManifest(null)
  }

  function getItemLabel() {
    return 'Page ' + (panelState?.item?.n ?? 'unknown')
  }

  useEffect(() => {
    if (selectedManifest) {
      externallyOpened.current = true
    }
  }, [selectedManifest])


  return (
    <>
      <Popover open={showItemModal} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant={showItemModal ? 'secondary' : 'ghost'}
            className="font-semibold text-gray-600"
            onClick={() =>  setShowItemModal(!showItemModal)}
            data-cy="item-label">
            { getItemLabel() }
          </Button>
        </PopoverTrigger>
        {showItemModal && <PopoverContent side="bottom" align="start" sideOffset={8} className="flex flex-col space-y-2 max-w-[200px] w-fit max-h-[450px] h-fit pr-0 pl-2 py-2">
          <div className="text-gray-600 ml-1">Please select an item to open</div>
          <div className="text-wrap">
            <div className="flex flex-col space-y-1 max-h-[350px] overflow-y-auto">
              {labels.length > 0 && labels.map((label, i) => <Button
                variant="ghost"
                style={{ color: 'Page '+ label === getItemLabel() ? primaryColor : '' }}
                key={i} className="text-wrap h-fit min-h-8 overflow-hidden justify-start pl-2 mr-2 py-1"
                title={label ?? ''}
                onClick={() => handleItemClick(label)}
              > {label }</Button>)}
            </div>
          </div>
        </PopoverContent>}
      </Popover>
    </>
  )
}

export default ItemLabel
