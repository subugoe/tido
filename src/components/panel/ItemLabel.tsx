import { FC, useEffect, useRef, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface ItemLabelProps {
  itemLabels: string[],
  updateItem: (newItemLabel: string) => void,
  showItemModal: boolean,
  setShowItemModal: (show: boolean) => void,
}

const ItemLabel: FC<ItemLabelProps> = ({ itemLabels, updateItem, showItemModal, setShowItemModal }) => {
  const { panelState } = usePanel()

  const [internalOpen, setInternalOpen] = useState(showItemModal)
  const externallyOpened = useRef(false)

  const handleOpenChange = (open: boolean) => {
    console.log('new value of open', open)
    if (!open && externallyOpened.current) {
      externallyOpened.current = false
      return
    }
    setInternalOpen(open)
    console.log('show item modal in ItemLabel', showItemModal)
    setShowItemModal(open)
  }

  function handleItemClick(newItemLabel: string) {
    setInternalOpen(false)
    setShowItemModal(false)
    updateItem(newItemLabel)
  }

  function getItemLabel() {
    return 'Page ' + (panelState?.item?.n ?? 'unknown')
  }

  useEffect(() => {
    // here first I need to get the manifests labels
    if (showItemModal) {
      externallyOpened.current = true
      console.log('opened from manifest modal')
    }
    setInternalOpen(showItemModal)
  }, [showItemModal])


  return (
    <>
      <Popover open={internalOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant={internalOpen ? 'secondary' : 'ghost'}
            className="font-semibold text-gray-600"
            onClick={() =>  setInternalOpen(!internalOpen)}
            data-cy="item-label">
            { getItemLabel() }
          </Button>
        </PopoverTrigger>
        {internalOpen && <PopoverContent side="bottom" align="start" sideOffset={8} className="flex flex-col space-y-4 max-w-[200px] w-fit max-h-[450px] h-fit pr-0 px-4 py-4">
          <div>Please select an item to open</div>
          <div className="text-wrap">
            <div className="flex flex-col space-y-2 max-h-[350px] overflow-y-auto">
              {itemLabels.map((label, i) => <Button
                variant="ghost"
                key={i} className="text-wrap h-fit min-h-8 overflow-hidden"
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
