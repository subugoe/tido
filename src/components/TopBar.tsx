import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useConfigStore } from '@/store/ConfigStore.tsx'

import Modal from '@/components/Modal.tsx'
import TreeSelectionModalContent from '@/components/tree/tree-modal/TreeSelectionModalContent.tsx'

import { useDataStore } from '@/store/DataStore.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ListCollapse, X } from 'lucide-react'

const TopBar: FC = () => {
  const showGlobalTreeConfig = useConfigStore(state => state.config.showGlobalTree)
  const showNewCollectionButton = useConfigStore(state => state.config.showNewCollectionButton)
  const [showNewCollectionPopover, setShowNewCollectionPopover] = useState(false)

  const setShowGlobalTree = useDataStore(state => state.setShowGlobalTree)
  const isGlobalTreeCollapsed = useDataStore(state => state.showGlobalTree)
  const { t } = useTranslation()

  function toggleGlobalTree() {
    setShowGlobalTree(!isGlobalTreeCollapsed)
  }

  return <div className="t-flex t-flex-row t-ml-6 t-mt-10 t-space-x-2">
    <button data-cy="global-tree-toggle" className={`${!showGlobalTreeConfig ? 't-hidden' : ''}`} onClick={toggleGlobalTree}>
      { !isGlobalTreeCollapsed ? <ListCollapse /> : <X /> }
    </button>
    { showNewCollectionButton &&
      <Modal
        showPopover={showNewCollectionPopover}
        onOpenChange={(isOpen) => setShowNewCollectionPopover(isOpen)}
        TriggerButton={<Button data-cy="new-collection">{t('new')}</Button>}
      >
        <TreeSelectionModalContent onConfirm={() => setShowNewCollectionPopover(false)} />
      </Modal> }
  </div>
}

export default TopBar
