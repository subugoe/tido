import { FC } from 'react'
import { useConfigStore } from '@/store/ConfigStore.tsx'

import { useTranslation } from 'react-i18next'


import Modal from '@/components/Modal.tsx'
import TreeSelectionModalContent from '@/components/tree/tree-modal/TreeSelectionModalContent.tsx'

import { useDataStore } from '@/store/DataStore.tsx'
import { Button } from '@/components/ui/button.tsx'

import SelectParallelPanels from '@/components/SelectParallelPanels.tsx'
import { ListCollapse, X } from 'lucide-react'


const TopBar: FC = () => {
  const { t } = useTranslation()
  const globalTree = useConfigStore(state => state.config.globalTree)

  const setShowGlobalTree = useDataStore(state => state.setShowGlobalTree)
  const showGlobalTree = useDataStore(state => state.showGlobalTree)

  function toggleGlobalTree() {
    setShowGlobalTree(!showGlobalTree)
  }


  return <div className="t-flex t-flex-row t-ml-6 t-mt-10 t-space-x-2">

    <button className={`toggle-global-tree ${!globalTree ? 't-hidden' : ''}`} onClick={toggleGlobalTree}>
      { !showGlobalTree ? <ListCollapse /> : <X /> }
    </button>
    <Modal TriggerButton={<Button>{t('new')}</Button>}>
      <TreeSelectionModalContent />
    </Modal>
    <Modal TriggerButton={<Button>{t('sync_panels')}</Button>}>
      <SelectParallelPanels />
    </Modal>
  </div>
}

export default TopBar
