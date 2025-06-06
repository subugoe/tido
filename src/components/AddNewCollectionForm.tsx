import { ChangeEvent, FC } from 'react'
import { Input } from '@/components/ui/input.tsx'
import { useTranslation } from 'react-i18next'
import { Label } from '@radix-ui/react-label'
import { useConfigStore } from '@/store/ConfigStore.tsx'
import { createCollectionNode } from '@/utils/tree.ts'
import { useDataStore } from '@/store/DataStore.tsx'
import { Button } from '@/components/ui/button.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { useUIStore } from '@/store/UIStore.tsx'

interface Props {
  onConfirm?: () => void
}

const AddNewCollectionForm: FC<Props> = ({ onConfirm }) => {
  const { t } = useTranslation()
  const addPanel = usePanelStore(state => state.addPanel)
  const initCollection = useDataStore.getState().initCollection

  let inputValue = ''

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    inputValue = event.target.value
  }

  async function onConfirmClick() {
    if (inputValue === '') return

    const newPanelId = crypto.randomUUID()
    useUIStore.getState().updateNewestPanelId(newPanelId)

    addPanel({
      collection: inputValue,
      manifestIndex: 0,
      itemIndex: 0
    }, newPanelId)

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
      <div className="flex items-end">
        <div className="mr-2 flex-1 flex flex-col">
          <Label htmlFor="add-new-panel-input" className="mb-2">{t('enter_collection_url')}</Label>
          <Input id="add-new-panel-input" onChange={onChange} />
        </div>
        <Button onClick={onConfirmClick}>{ t('confirm') }</Button>
      </div>

    </>
  )
}
export default AddNewCollectionForm
