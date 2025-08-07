import { FC, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { apiRequest } from '@/utils/api.ts'
import { usePanelStore } from '@/store/PanelStore.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'

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
    <DropdownMenu
      open={showItemModal}
      onOpenChange={handleOpenChange}
    >
      <DropdownMenuTrigger asChild>
        <div className={`text-sm text-nowrap max-w-[200px] truncate font-semibold ${showItemModal ? 'bg-muted' : 'bg-accent'} rounded-lg cursor-pointer hover:bg-muted px-2 py-1`}
          data-cy="item-label">
          { getItemLabel() }
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent data-cy="items-dropdown">
        {labels.map((label, i) => <DropdownMenuItem
          key={label + '_'+i}
          className={`cursor-pointer ${panelState.item.n === label ? 'data-[highlighted]:text-primary text-primary' : ''} `}
          title={label ?? ''}
          onClick={() => handleItemClick(label)}
        > { label }
        </DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ItemLabel
