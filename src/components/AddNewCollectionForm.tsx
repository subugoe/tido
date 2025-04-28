import { ChangeEvent, FC } from 'react'
import { Input } from '@/components/ui/input.tsx'
import { useTranslation } from 'react-i18next'
import { Label } from '@radix-ui/react-label'
import { useConfigStore } from '@/store/ConfigStore.tsx'
import { createCollectionNode } from '@/utils/tree.ts'
import { useDataStore } from '@/store/DataStore.tsx'
import { Button } from '@/components/ui/button.tsx'

interface Props {
  onConfirm?: () => void
}

const AddNewCollectionForm: FC<Props> = ({ onConfirm }) => {
  const { t } = useTranslation()
  const addNewPanel = useConfigStore.getState().addNewPanel
  const initCollection = useDataStore.getState().initCollection

  let inputValue = ''

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    inputValue = event.target.value
  }

  async function onConfirmClick() {
    if (inputValue === '') return

    addNewPanel(
      {
        collection: inputValue,
        manifestIndex: 0,
        itemIndex: 0
      }
    )

    if (!(useConfigStore.getState().config.rootCollections.includes(inputValue))) {
      const newRootNode = await createCollectionNode(inputValue)
      useDataStore.getState().appendRootNode(newRootNode)
      useConfigStore.getState().addRootCollection(inputValue)
    }

    await initCollection(inputValue)

    if (onConfirm) onConfirm()
  }

  return (
    <>
      <div className="t-flex t-items-end">
        <div className="t-mr-2 t-flex-1 t-flex t-flex-col">
          <Label htmlFor="add-new-panel-input" className="t-mb-2">{t('enter_collection_url')}</Label>
          <Input id="add-new-panel-input" onChange={onChange} />
        </div>
        <Button onClick={onConfirmClick}>{ t('confirm') }</Button>
      </div>

    </>
  )
}
export default AddNewCollectionForm
