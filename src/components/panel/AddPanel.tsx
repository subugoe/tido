import { FC, useState } from 'react'

import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx'
import TreeSelection from '@/components/tree/TreeSelection.tsx'

const Panel: FC = () => {
  const { t } = useTranslation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <div
        className={
          `group relative flex shrink-0 flex-col items-center justify-center w-[600px] hover:border-primary border-2 border-gray-200 rounded-lg
        p-3 px-4 cursor-pointer transition-all`}
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="p-6 bg-gray-100 rounded-full leading-none">
          <Plus className="text-gray-400 group-hover:text-primary" size="40" />
        </div>
        <span className="mt-4 text-gray-400 font-semibold group-hover:text-primary">{t('add_new_panel')}</span>
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
            <TreeSelection onConfirm={() => setIsDialogOpen(false)} />
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Panel
