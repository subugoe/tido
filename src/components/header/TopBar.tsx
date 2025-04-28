import { FC } from 'react'

import { useConfigStore } from '@/store/ConfigStore.tsx'

import { useDataStore } from '@/store/DataStore.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Menu, X } from 'lucide-react'
import Title from '@/components/header/Title.tsx'

import AddNewPanel from '@/components/header/AddNewPanel.tsx'

const TopBar: FC = () => {
  const showGlobalTreeConfig = useConfigStore(state => state.config.showGlobalTree)
  const showNewCollectionButton = useConfigStore(state => state.config.showNewCollectionButton)
  const title = useConfigStore(state => state.config.title)

  const setShowGlobalTree = useDataStore(state => state.setShowGlobalTree)
  const isGlobalTreeCollapsed = useDataStore(state => state.showGlobalTree)

  function toggleGlobalTree() {
    setShowGlobalTree(!isGlobalTreeCollapsed)
  }

  return <div className="t-flex t-flex-row t-items-center">
    <Button data-cy="global-tree-toggle" variant="ghost" size="iconLg" className={`${!showGlobalTreeConfig ? 't-hidden' : ''} t-mt-0.5 t-mr-2 -t-ml-2`} onClick={toggleGlobalTree}>
      { !isGlobalTreeCollapsed ? <Menu /> : <X /> }
    </Button>
    { title !== '' && <Title /> }
    { showNewCollectionButton && <AddNewPanel /> }
  </div>
}

export default TopBar
