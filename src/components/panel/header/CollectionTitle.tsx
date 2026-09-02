import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'

import LocalTree from '@/components/tree/LocalTree.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { X } from 'lucide-react'


const CollectionTitle: FC = () => {
  const { panelState, usePanelTranslation } = usePanel()
  const collection = useDataStore(
    (state) => panelState && panelState.collectionId ? state.collections[panelState.collectionId] : null
  )

  const [showLocalTree, setShowLocalTree] = useState(false)
  const { t } = usePanelTranslation()

  const handleOpenChange = (open: boolean) => {
    setShowLocalTree(open)
  }

  function closeLocalTree() {
    setShowLocalTree(false)
  }

  return (
    <>
      { !collection && <Skeleton className="w-[200px] h-6" /> }
      {collection && <Popover open={showLocalTree} onOpenChange={handleOpenChange} modal={true}>
        <PopoverTrigger asChild>
          <Button
            className="absolute font-semibold truncate max-w-[150px] @min-[1000px]/panel:max-w-[250px]"
            title={collection.titles[0]}
            onClick={() => setShowLocalTree(!showLocalTree)}
            size="sm"
            variant="outline"
            data-cy="collection-title"
          >
            <span className="truncate">{ collection.titles[0] }</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start" className="w-[400px] pr-0">
          <div className="font-semibold mb-2">{t('choose_your_panel_content')}</div>
          <LocalTree collectionId={panelState.collectionId} onSelect={closeLocalTree} />
          <X
            className="absolute right-3 top-4 text-zinc-600 hover:text-zinc-700 cursor-pointer"
            size={15} onClick={() => setShowLocalTree(false)}
          />
        </PopoverContent>
      </Popover>
      }
    </>

  )
}

export default CollectionTitle
