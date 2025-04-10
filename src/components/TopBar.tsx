import { FC } from 'react'

import { useConfigStore } from '@/store/ConfigStore.tsx'

import Modal from '@/components/Modal.tsx'
import TreeSelectionModalContent from '@/components/tree/tree-modal/TreeSelectionModalContent.tsx'

import { useDataStore } from '@/store/DataStore.tsx'
import { Button } from '@/components/ui/button.tsx'
import SelectParallelPanels from '@/components/SelectParallelPanels.tsx'
import { ListCollapse, X } from 'lucide-react'


const TopBar: FC = () => {
  const showGlobalTreeConfig = useConfigStore(state => state.config.showGlobalTree)
  const showNewCollectionButton = useConfigStore(state => state.config.showNewCollectionButton)

  const setShowGlobalTree = useDataStore(state => state.setShowGlobalTree)
  const isGlobalTreeCollapsed = useDataStore(state => state.showGlobalTree)

  function toggleGlobalTree() {
    setShowGlobalTree(!isGlobalTreeCollapsed)
  }

  return <div className="t-flex t-flex-row t-ml-6 t-mt-10 t-space-x-2">
    <button data-cy="global-tree-toggle" className={`${!showGlobalTreeConfig ? 't-hidden' : ''}`} onClick={toggleGlobalTree}>
      { !isGlobalTreeCollapsed ? <ListCollapse /> : <X /> }
    </button>
    { showNewCollectionButton &&
      <Modal TriggerButton={<Button data-cy="new-collection">New</Button>}>
        <TreeSelectionModalContent />
      </Modal> }
    <Modal TriggerButton={<Button>Sync Panels</Button>}>
      <SelectParallelPanels />
    </Modal>
  </div>
}

export default TopBar
