import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx'
import TreeSelection from '@/components/tree/TreeSelection.tsx'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

const ExistingCollectionDialog: FC<Props> = ({ open, onOpenChange, onConfirm }) => {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-cy="existing-collection-modal">
        <DialogHeader>
          <DialogTitle>{t('from_existing_collections')}</DialogTitle>
        </DialogHeader>
        <TreeSelection onConfirm={onConfirm} />
      </DialogContent>
    </Dialog>
  )
}

export default ExistingCollectionDialog
