
// html: title
// gets the index of the selected item inside a certain manifest
// updates the item in PanelState

import { FC } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import  Modal  from '@/components/Modal.tsx'
import ItemSelectionModalContent from "@/components/tree/tree-modal/ItemSelectionModalContent.tsx";


interface ItemSelectionProps {
  title: string
}

const ItemSelection: FC<ItemSelectionProps> = ({ title }) => {

  const { panelState } = usePanel()

  const itemTitleButton = <a> <span className="t-text-gray-600 hover:t-cursor-pointer">{ title }</span> </a>

  function getManifestItemsTitles (manifest) {
    return manifest.sequence.map((item: Sequence, _) => item.label)
  }

  return <div className="">
    <Modal TriggerButton={itemTitleButton}>
       <ItemSelectionModalContent itemsList={getManifestItemsTitles(panelState.manifest)} />
    </Modal>

  </div>
}

export default ItemSelection

