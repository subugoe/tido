import { FC, useState } from 'react'

import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import TreeSelectionModalContent from '@/components/tree/tree-modal/TreeSelectionModalContent.tsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx'

const Panel: FC = () => {
  const { t } = useTranslation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <div
        className={
          `t-group t-relative t-flex t-flex-shrink-0 t-flex-col t-items-center t-justify-center t-w-[600px] t-border-solid hover:t-border-primary t-border-2 t-rounded-lg 
        t-p-3 t-px-4 t-cursor-pointer t-transition-all`}
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="t-p-6 t-bg-gray-100 t-rounded-full t-leading-none">
          <Plus className="t-text-gray-400 group-hover:t-text-primary" size="40" />
        </div>
        <span className="t-mt-4 t-text-gray-400 t-font-semibold group-hover:t-text-primary">{t('add_new_panel')}</span>
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
            <TreeSelectionModalContent onConfirm={() => setIsDialogOpen(false)} />
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Panel
