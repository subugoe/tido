import { FC, useEffect, useRef, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useTranslation } from 'react-i18next'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { apiRequest } from '@/utils/api.ts'
import { usePanelStore } from '@/store/PanelStore.tsx'

interface ItemLabelProps {
  selectedManifest: Manifest | null
  onItemSelect: () => void
}

const ItemLabel: FC<ItemLabelProps> = ({ selectedManifest, onItemSelect }) => {
  const { panelState } = usePanel()
  const { t } = useTranslation()
  const collection = useDataStore().collections[panelState.collectionId]?.collection
  const manifest = panelState.manifest
  const updatePanel = usePanelStore(state => state.updatePanel)

  const [showItemModal, setShowItemModal] = useState(false)
  const [labels, setLabels] = useState([])
  const externallyOpened = useRef(false)


  useEffect(() => {
    let labels
    if (!collection) return
    if (selectedManifest) {
      labels = selectedManifest.sequence.map((item) => item.label) || []
      setShowItemModal(true)
    }
    else {
      labels = manifest.sequence.map((item) => item.label)
    }

    setLabels(labels)
  }, [collection, manifest, selectedManifest])


  const handleOpenChange = (open: boolean) => {
    // following if is used to prevent the natural close (not allowing setShowItemModal(open) to execute) of itemModal when we select a manifest label in modal. Without this if statement, the item modal opens and closes immediately, which is not what we want.
    if (!open && externallyOpened.current) {
      externallyOpened.current = false
      return
    }

    onItemSelect()
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
    onItemSelect()
  }

  function getItemLabel() {
    return t('item') + ' ' + (panelState?.item?.n ?? 'unknown')
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
            onClick={() =>  setShowItemModal(!showItemModal)}
            className="px-2 py-1 h-7 w-24"
            title={getItemLabel()}
            data-cy="item-label">
            <div className="text-sm rounded-md font-semibold truncate">
              {getItemLabel()}
            </div>
          </Button>
        </PopoverTrigger>
        {showItemModal && <PopoverContent side="bottom" align="start" sideOffset={8} className="flex flex-col space-y-2 max-w-[200px] w-fit max-h-[450px] h-fit pr-0 pl-0 py-2">
          <div className="text-wrap text-muted-foreground ml-1 mb-0 pl-1">{ t('please_select_an_item_to_open') }</div>
          <div className="flex flex-col space-y-1 max-h-[350px] overflow-y-auto pb-1 pt-1 pl-1">
            {labels.length > 0 && labels.map((label, i) => <Button
              variant="ghost"
              key={label + '_'+ i} className={`h-8 overflow-hidden justify-start mr-2 py-1 pl-2 ${panelState.item.n === label ? 'text-primary hover:text-primary': ''}`}
              title={label ?? ''}
              onClick={() => handleItemClick(label)}
            > {label }</Button>)}
          </div>
        </PopoverContent>}
      </Popover>
    </>
  )
}

export default ItemLabel
