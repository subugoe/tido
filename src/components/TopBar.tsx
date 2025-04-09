import { FC } from 'react'

import { useConfigStore } from '@/store/ConfigStore.tsx'

import Modal from '@/components/Modal.tsx'
import TreeSelectionModalContent from '@/components/tree/tree-modal/TreeSelectionModalContent.tsx'

import { useDataStore } from '@/store/DataStore.tsx'
import { Button } from '@/components/ui/button.tsx'
import SelectParallelPanels from '@/components/SelectParallelPanels.tsx'
import { ListCollapse, X } from 'lucide-react'

import { useTranslation } from 'react-i18next'


const TopBar: FC = () => {
  const globalTree = useConfigStore(state => state.config.globalTree)
  const showNewCollectionButton = useConfigStore(state => state.config.showNewCollectionButton)

  const setShowGlobalTree = useDataStore(state => state.setShowGlobalTree)
  const showGlobalTree = useDataStore(state => state.showGlobalTree)
  const { t } = useTranslation()


  function toggleGlobalTree() {
    setShowGlobalTree(!showGlobalTree)
  }

  return <div className="t-flex t-flex-row t-ml-6 t-mt-10 t-space-x-2">
    <button className={`toggle-global-tree ${!globalTree ? 't-hidden' : ''}`} onClick={toggleGlobalTree}>
      { !showGlobalTree ? <ListCollapse /> : <X /> }
    </button>
    { showNewCollectionButton &&
      <Modal TriggerButton={<Button data-cy="new-collection"> {t('new')} </Button>}>
        <TreeSelectionModalContent />
      </Modal> }
    <Modal TriggerButton={<Button>{ t('sync_panels') }</Button>}>
      <SelectParallelPanels />
    </Modal>
  </div>
}

export default TopBar
