import { FC } from 'react'

import { useConfigStore } from '@/store/ConfigStore.tsx'

import { useDataStore } from '@/store/DataStore.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Menu, X } from 'lucide-react'
import Title from '@/components/header/Title.tsx'

import AddNewPanel from '@/components/header/AddNewPanel.tsx'

const TopBar: FC = () => {
  const showGlobalTreeConfig = useConfigStore(state => state.config.showGlobalTree)
  const showAddNewPanelButton = useConfigStore(state => state.config.showAddNewPanelButton)
  const title = useConfigStore(state => state.config.title)

  const setShowGlobalTree = useDataStore(state => state.setShowGlobalTree)
  const isGlobalTreeCollapsed = useDataStore(state => state.showGlobalTree)

  function toggleGlobalTree() {
    setShowGlobalTree(!isGlobalTreeCollapsed)
  }

  return <div className="flex flex-row items-center">
    <Button data-cy="global-tree-toggle" variant="ghost" size="iconLg" className={`${!showGlobalTreeConfig ? 'hidden' : ''} mt-0.5 mr-2 -ml-2`} onClick={toggleGlobalTree}>
      { !isGlobalTreeCollapsed ? <Menu /> : <X /> }
    </Button>
    { title !== '' && <Title /> }
    { showAddNewPanelButton && <AddNewPanel /> }
  </div>
}

export default TopBar
