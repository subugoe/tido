import { FC, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Plus } from 'lucide-react'
import AddNewPanelSelection from '@/components/header/AddNewPanelSelection.tsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx'
import { useTranslation } from 'react-i18next'
import AddNewCollectionForm from '@/components/AddNewCollectionForm.tsx'
import TreeSelection from '@/components/tree/TreeSelection.tsx'
import { useConfigStore } from '@/store/ConfigStore.tsx'

const AddNewPanel: FC = () => {
  const title = useConfigStore(state => state.config.title)
  const allowNewCollections = useConfigStore(state => state.config.allowNewCollections)

  const { t } = useTranslation()

  const [showPopover, setShowPopover] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [step, setStep] = useState(1)

  function onSelect(value: 'new' | 'existing') {
    if (value === 'new') setStep(1)
    else if (value === 'existing') setStep(2)

    setShowPopover(false)
    setShowDialog(true)
  }

  function onConfirmNewCollectionForm() {
    setShowDialog(false)
  }

  function renderTriggerButton() {
    return <Button
      {...(allowNewCollections ? {} : { onClick: () => {
        setStep(2)
        setShowDialog(true)
      } })}
      data-cy="new-panel"
      className={title !== '' ? 'ml-auto' : ''}
    >
      <Plus className="-ml-1 mr-2" />{t('add_new_panel')}
    </Button>
  }


  return (
    <>
      {allowNewCollections && <Popover
        open={showPopover}
        onOpenChange={(isOpen) => setShowPopover(isOpen)}
      >
        <PopoverTrigger asChild>
          { renderTriggerButton() }
        </PopoverTrigger>
        <PopoverContent align="end" className="p-0!">
          <AddNewPanelSelection onSelect={onSelect} />
        </PopoverContent>
      </Popover>}

      {!allowNewCollections && renderTriggerButton() }

      <Dialog
        open={showDialog}
        onOpenChange={(isOpen) => setShowDialog(isOpen)}
        modal={true}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{ t('choose_your_panel_content') }</DialogTitle>
          </DialogHeader>
          <DialogDescription asChild>
            <>
              { step === 1 && <AddNewCollectionForm onConfirm={onConfirmNewCollectionForm} /> }
              { step === 2 && <TreeSelection onConfirm={onConfirmNewCollectionForm} /> }
            </>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddNewPanel
