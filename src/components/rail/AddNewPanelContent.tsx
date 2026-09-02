import { FC, useState } from 'react'
import { Blocks, ListTree, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx'
import TreeSelection from '@/components/tree/TreeSelection.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { useTranslation } from 'react-i18next'
import { createCollectionNode } from '@/utils/tree.ts'
import { useDataStore } from '@/store/DataStore.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { useUIStore } from '@/store/UIStore.tsx'
import { useRailStore } from '@/store/RailStore.tsx'

type DialogValue = 'new' | 'existing' | null

const AddNewPanelContent: FC = () => {
  const { allowNewCollections, rootCollections } = useConfig()
  const { t } = useTranslation()

  const [dialog, setDialog] = useState<DialogValue>(null)
  const [inputValue, setInputValue] = useState('')

  const setActiveView = useRailStore(state => state.setActiveView)

  async function handleAdd() {
    if (!inputValue.trim()) return

    const url = inputValue.trim()
    const newPanelId = crypto.randomUUID()
    useUIStore.getState().updateNewestPanelId(newPanelId)
    usePanelStore.getState().addPanel({ collection: url }, newPanelId)

    if (!rootCollections.includes(url)) {
      const newRootNode = await createCollectionNode(url)
      useDataStore.getState().appendRootNode(newRootNode)
    }

    await useDataStore.getState().initCollection(url)

    setInputValue('')
    closeAndCollapse()
  }

  function closeAndCollapse() {
    setDialog(null)
    setActiveView(null)
  }

  const selectionItems = [
    {
      id: 'new' as const,
      title: t('new_collection'),
      subtitle: t('from_new_collection_description'),
      icon: <Blocks size={20} />,
      disabled: !allowNewCollections
    },
    {
      id: 'existing' as const,
      title: t('from_existing_collections'),
      subtitle: t('from_existing_collections_description'),
      icon: <ListTree size={20} />
    }
  ]

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {selectionItems.map(({ id, title, subtitle, icon, disabled }) => (
          <Button
            key={id}
            disabled={disabled}
            onClick={() => setDialog(id)}
            data-cy={`open-new-panel-${id}`}
            variant="ghost"
            size="lg"
            className="h-auto group flex items-start hover:bg-accent dark:hover:bg-accent gap-3 rounded-xl py-4 px-3 text-left transition-colors"
          >
            <div className="aspect-square w-10 h-10 shrink-0 rounded-full border-2 border-border flex items-center justify-center transition-colors group-hover:border-primary group-hover:text-primary">
              {icon}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-foreground font-semibold transition-colors group-hover:text-primary">{title}</p>
              <p className="text-sm font-normal text-muted-foreground text-wrap">{subtitle}</p>
            </div>
          </Button>
        ))}
      </div>

      <Dialog open={dialog === 'new'} onOpenChange={(isOpen) => !isOpen && setDialog(null)}>
        <DialogContent data-cy="new-collection-modal">
          <DialogHeader>
            <DialogTitle>{t('new_collection')}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium">{t('enter_collection_url')}</span>
            <Input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="https://..."
              data-cy="new-collection-input"
            />
            <Button
              onClick={handleAdd}
              disabled={!inputValue.trim()}
              className="w-fit gap-2"
              data-cy="new-collection-add"
            >
              <Plus />
              {t('confirm')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === 'existing'} onOpenChange={(isOpen) => !isOpen && setDialog(null)}>
        <DialogContent data-cy="existing-collection-modal">
          <DialogHeader>
            <DialogTitle>{t('from_existing_collections')}</DialogTitle>
          </DialogHeader>
          <TreeSelection onConfirm={closeAndCollapse} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddNewPanelContent
