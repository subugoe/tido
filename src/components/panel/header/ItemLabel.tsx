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
  onSelect: (item: Item) => void
  onDropdownClose: (closeWithoutSelect: boolean) => void
}

const ItemLabel: FC<ItemLabelProps> = ({ selectedManifest, onSelect, onDropdownClose }) => {
  const { panelState, usePanelTranslation, init } = usePanel()
  const { t } = usePanelTranslation()
  const collection = useDataStore().collections[panelState.collectionId]
  const manifest = panelState.manifest

  const [showDropdown, setShowDropdown] = useState(false)
  const [labels, setLabels] = useState<{id: string, label: string}[]>([])
  const skipOnItemSelect = useRef(false)

  useEffect(() => {
    if (!collection) return
    const targetManifest = selectedManifest || manifest
    if (!targetManifest) return

    const items = (targetManifest.items || [])
      .map(item => {
        const id = typeof item === 'object' ? item.id : item
        const label = t(typeof item === 'object' ? item.division : id.split('/').pop())
        return { id, label }
      })

    setLabels(items)

    if (selectedManifest) {
      setShowDropdown(true)
    }
  }, [collection, manifest, selectedManifest])

  const handleOpenChange = (open: boolean) => {
    setShowDropdown(open)
    if (!open && !skipOnItemSelect.current) {
      onDropdownClose(true)
    }
    skipOnItemSelect.current = false
  }

  async function getItem(newItemId: string) {
    if (!newItemId) return null
    return await apiRequest<Item>(newItemId)
  }

  async function handleItemClick(newItemId: string) {
    const targetManifest = selectedManifest || panelState.manifest
    if (!targetManifest) return

    skipOnItemSelect.current = true

    const item = await getItem(newItemId)

    if (!item) {
      skipOnItemSelect.current = false
      return
    }

    setShowDropdown(false)
    await init({ ...panelState.config, manifest: targetManifest.id, item: item.id })
    onSelect(item)
  }

  function getItemLabel() {
    return t(panelState?.item?.division ?? 'unknown')
  }

  return (
    <DropdownMenu
      open={showDropdown}
      onOpenChange={handleOpenChange}
    >
      <DropdownMenuTrigger asChild>
        <div className={`text-sm text-nowrap max-w-[120px] @min-[1200px]/panel:max-w-[300px] truncate font-semibold ${showDropdown ? 'bg-accent' : 'bg-muted'} rounded-lg cursor-pointer hover:bg-accent px-2 py-1`}
          data-cy="item-label">
          { getItemLabel() }
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent data-cy="items-dropdown" className="max-w-80">
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
