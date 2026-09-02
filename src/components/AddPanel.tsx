import { FC, useState } from 'react'

import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx'
import TreeSelection from '@/components/tree/TreeSelection.tsx'

const AddPanel: FC = () => {
  const { t } = useTranslation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  function onConfirm() {
    setIsDialogOpen(false)
  }

  return (
    <>
      <div
        data-panel-placeholder
        className={
          `group relative text-foreground flex shrink-0 flex-col items-center justify-center w-[330px] hover:border-primary border border-border rounded-2xl
        p-3 px-4 cursor-pointer transition-all`}
        onClick={() => setIsDialogOpen(true)}
        data-cy="panel-placeholder"
      >
        <div className="p-6 bg-muted rounded-full leading-none">
          <Plus className="text-gray-400 group-hover:text-primary" size="40" />
        </div>
        <span className="mt-4 text-gray-400 font-semibold group-hover:text-primary">{t('open_new_panel')}</span>
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

export default AddPanel
