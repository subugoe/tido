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
  const { panelState, updatePanel, usePanelTranslation, containerRef } = usePanel()
  const { t } = usePanelTranslation()
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
    const items = (targetManifest.items || [])
      .map(item => {
        const id = typeof item === 'object' ? item.id : item
        const label = t(typeof item === 'object' ? item.division : id.split('/').pop())
        return { id, label }
      })

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

  async function getItem(newItemId: string) {
    // Find the item ID by matching the label (which is derived from the ID)
    if (!newItemId) return null
    return await apiRequest<Item>(newItemId)
  }

  async function handleItemClick(newItemId: string) {
    const targetManifest = selectedManifest || panelState.manifest
    if (!targetManifest) return

    const item = await getItem(newItemId)

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
    return t(panelState?.item?.division ?? 'unknown')
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
      <DropdownMenuContent data-cy="items-dropdown" className="max-w-80" container={containerRef.current}>
        {labels.map((item, i) => <DropdownMenuItem
          key={item.id + '_'+i}
          className={`cursor-pointer ${panelState.item?.id === item.id ? 'data-[highlighted]:text-primary text-primary' : ''} `}
          title={item.label ?? ''}
          onClick={() => handleItemClick(item.id)}
        > { item.label }
        </DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ItemLabel
