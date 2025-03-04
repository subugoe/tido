import { FC, useState } from 'react'

import { useConfigStore } from '@/store/ConfigStore.tsx'

import Modal from '@/components/Modal.tsx'
import TreeSelectionModalContent from '@/components/tree/tree-modal/TreeSelectionModalContent.tsx'
import IconRenderer from '@/components/base/IconRenderer.tsx'

import { tree } from '@/utils/icons'
import { cross } from '@/utils/icons'
import { useDataStore } from '@/store/DataStore.tsx'
import { Button } from '@/components/ui/button.tsx'
import SelectParallelPanels from '@/components/SelectParallelPanels.tsx'


const TopBar: FC = () => {

  const [iconHtmlString, setIconHtmlString] = useState(tree)
  const globalTree = useConfigStore(state => state.config.globalTree)

  const setShowGlobalTree = useDataStore(state => state.setShowGlobalTree)

  function toggleIcon() {
    if (iconHtmlString === tree) {
      // we click the tree icon - now we show the global tree (set the value to true)
      setShowGlobalTree(true)
      setIconHtmlString(cross)
    } else if (iconHtmlString === cross) {
      setShowGlobalTree(false)
      setIconHtmlString(tree)
    }
  }

  return <div className="t-flex t-flex-row t-ml-6 t-mt-10 t-space-x-2">
    <button className={`toggle-global-tree ${!globalTree ? 't-hidden' : ''}`} onClick={() => toggleIcon()}>
      <IconRenderer
        htmlString={iconHtmlString}
        width={8}
        height={8} />
    </button>
    <Modal TriggerButton={<Button>New</Button>}>
      <TreeSelectionModalContent />
    </Modal>
    <Modal TriggerButton={<Button>Sync Panels</Button>}>
      <SelectParallelPanels />
    </Modal>
  </div>
}

export default TopBar
