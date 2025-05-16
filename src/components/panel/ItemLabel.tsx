import { FC } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'

interface ItemLabelProps {
  label: string,
  itemLabels: string[],
  handleItemClick: (newItemLabel: string) => void,
  showItemModal: boolean,
  setShowItemModal: (show: boolean) => void,
}

const ItemLabel: FC<ItemLabelProps> = ({ label, itemLabels, handleItemClick, showItemModal, setShowItemModal }) => {

  const handleOpenChange = (open: boolean) => {
    setShowItemModal(open)
  }


  return (
    <>
      <Popover open={showItemModal} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant={showItemModal ? 'secondary' : 'ghost'}
            className="font-semibold text-gray-600"
            onClick={() =>  setShowItemModal(!showItemModal)}
            data-cy="item-label">
            { label }
          </Button>
        </PopoverTrigger>
        {showItemModal && <PopoverContent side="bottom" align="start" sideOffset={8} className="flex flex-col space-y-2 max-w-[200px] w-fit max-h-[450px] h-fit pr-0 px-4 py-4">
          <div>Please select an item to open from this manifest</div>
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
