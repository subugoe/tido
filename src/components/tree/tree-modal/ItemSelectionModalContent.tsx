import { FC } from 'react'
import CustomHTML from "@/components/CustomHTML.tsx";


interface ItemSelectionModalContentProps {
  itemsList: string[]
}

const ItemSelectionModalContent: FC<ItemSelectionModalContentProps> = ({ itemsList}) => {

  console.log('itemsList', itemsList)

  return <div className="items-list">
    {itemsList && itemsList.length > 0 &&  itemsList.map((label, i) => <span key={i}> {label} </span>)}
  </div>
}

export default ItemSelectionModalContent
