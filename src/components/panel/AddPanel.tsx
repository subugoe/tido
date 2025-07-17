import { FC, useState } from 'react'

import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx'
import TreeSelection from '@/components/tree/TreeSelection.tsx'
import { useUIStore } from '@/store/UIStore.tsx'

const Panel: FC = () => {
  const { t } = useTranslation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const enabledSelectTextView = useUIStore(state => state.enabledSelectPanelMode)

  function onConfirm() {
    setIsDialogOpen(false)
    if (enabledSelectTextView) useUIStore.getState().updateShowSelectPanelMode(true)
  }

  return (
    <>
      <div
        data-panel-placeholder
        className={
          `group relative bg-background text-foreground flex shrink-0 flex-col items-center justify-center w-[600px] hover:border-primary border-2 border-border rounded-lg
        p-3 px-4 cursor-pointer transition-all`}
        onClick={() => setIsDialogOpen(true)}
        data-cy="panel-placeholder"
      >
        <div className="p-6 bg-muted rounded-full leading-none">
          <Plus className="text-gray-400 group-hover:text-primary" size="40" />
        </div>
        <span className="mt-4 text-muted-foreground font-semibold group-hover:text-primary">{t('add_new_panel')}</span>
      </div>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(isOpen) => setIsDialogOpen(isOpen)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{ t('choose_your_panel_content') }</DialogTitle>
          </DialogHeader>
          <DialogDescription asChild>
            <TreeSelection onConfirm={() => onConfirm()} />
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Panel
