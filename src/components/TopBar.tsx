import { FC, useState } from 'react'

import { configStore } from '@/store/ConfigStore.tsx'

import Modal from '@/components/Modal.tsx'
import TreeSelectionModalContent from '@/components/tree-modal/TreeSelectionModalContent.tsx'
import IconRenderer from '@/components/base/IconRenderer.tsx'

import { tree } from '@/utils/icons'
import { cross } from '@/utils/icons'
import { dataStore } from '@/store/DataStore.tsx'


const TopBar: FC = () => {

  const [iconHtmlString, setIconHtmlString] = useState(tree)
  const globalTree = configStore(state => state.config.globalTree)

  const setShowGlobalTree = dataStore(state => state.setShowGlobalTree)

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

  const addButton =
    <span
      className="t-bg-blue-500 t-text-white t-rounded t-flex t-pl-4 t-items-center t-justify-items-center t-w-16 t-h-10">
        New
    </span>


  return <div className="t-flex t-flex-row t-ml-[6%] t-mt-10">
    <button className={`t-mr-2 toggle-global-tree ${!globalTree ? 't-hidden' : ''}`} onClick={() => toggleIcon()}>
      <IconRenderer
        htmlString={iconHtmlString}
        width={8}
        height={8}/>
    </button>
    <Modal TriggerButton={addButton}>
      <TreeSelectionModalContent/>
    </Modal>
  </div>
}

export default TopBar
