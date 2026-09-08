import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'

import CollectionTreePopover from '@/components/panel/header/CollectionTreePopover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { FolderTree } from 'lucide-react'

const CollectionIconButton: FC = () => {
  const { panelState } = usePanel()
  const collection = useDataStore(
    (state) => panelState && panelState.collectionId ? state.collections[panelState.collectionId] : null
  )

  if (!collection) return null

  return (
    <CollectionTreePopover trigger={
      <Button
        className="shrink-0 px-2"
        title={collection.titles[0]}
        size="sm"
        variant="outline"
        data-cy="collection-icon-button"
      >
        <FolderTree size={16} />
      </Button>
    } collectionId={panelState.collectionId} />
  )
}

export default CollectionIconButton