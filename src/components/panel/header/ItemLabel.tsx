import { FC, useEffect, useRef, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { apiRequest } from '@/utils/api.ts'
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
  const { panelState, updatePanel } = usePanel()
  const collection = useDataStore().collections[panelState.collectionId]
  const manifest = panelState.manifest

  const [showItemModal, setShowItemModal] = useState(false)
  const [labels, setLabels] = useState<{id: string, label: string}[]>([])
  const externallyOpened = useRef(false)

  useEffect(() => {
    if (!collection) return
    const targetManifest = selectedManifest || manifest
    if (!targetManifest) return

    // items is now string[] (IDs), create labels with IDs
    const items = targetManifest.items?.map((id) => ({ id, label: id.split('/').pop() || '' })) || []
    setLabels(items)

    if (selectedManifest) {
      setShowItemModal(true)
    }
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
    // Find the item ID by matching the label (which is derived from the ID)
    const newItemId = manifest.items?.find((id) => {
      const label = id.split('/').pop() || ''
      return label === newItemLabel
    })
    if (!newItemId) return null
    return await apiRequest<Item>(newItemId)
  }

  async function handleItemClick(newItemLabel: string) {
    const targetManifest = selectedManifest || panelState.manifest
    if (!targetManifest) return

    const item = await getItem(newItemLabel, targetManifest)

    if (!item) return

    updatePanel({
      manifest: targetManifest,
      item,
      config: { ...panelState.config, manifest: targetManifest.id, item: item.id }
    })

    setShowItemModal(false)
    onItemSelect()
  }

  function getItemLabel() {
    return panelState?.item?.titles?.[0] ?? 'unknown'
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
        <div className={`text-sm text-nowrap max-w-[120px] @min-[1200px]/panel:max-w-[300px] truncate font-semibold ${showItemModal ? 'bg-accent' : 'bg-muted'} rounded-lg cursor-pointer hover:bg-accent px-2 py-1`}
          data-cy="item-label">
          { getItemLabel() }
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent data-cy="items-dropdown" className="max-w-80">
        {labels.map((item, i) => <DropdownMenuItem
          key={item.id + '_'+i}
          className={`cursor-pointer ${panelState.item?.id === item.id ? 'data-[highlighted]:text-primary text-primary' : ''} `}
          title={item.label ?? ''}
          onClick={() => handleItemClick(item.label)}
        > { item.label }
        </DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ItemLabel
