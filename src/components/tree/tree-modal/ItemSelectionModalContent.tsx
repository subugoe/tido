import { FC } from 'react'


interface ItemSelectionModalContentProps {
  itemsList: string[]
}

const ItemSelectionModalContent: FC<ItemSelectionModalContentProps> = ({ itemsList}) => {


  return <div>
    <div className="items-list t-w-auto t-pr-4 t-max-h-80 t-overflow-y-auto">
      {itemsList && itemsList.length > 0
        &&  itemsList.map((label, i) =>
          <div className="t-p-2 hover:t-cursor-pointer hover:t-bg-gray-100 t-rounded-md t-mb-2" key={i}> {label} </div>)}
    </div>
  </div>
}

export default ItemSelectionModalContent
