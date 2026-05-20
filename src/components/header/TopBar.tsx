import { FC } from 'react'
import { useDataStore } from '@/store/DataStore.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Menu, X } from 'lucide-react'
import Title from '@/components/header/Title.tsx'
import AddNewPanel from '@/components/header/AddNewPanel.tsx'
import Settings from '@/components/header/settings/Settings.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import Share from '@/components/header/Share.tsx'

const TopBar: FC = () => {
  const { showGlobalTree, showAddNewPanelButton, title } = useConfig()

  const setShowGlobalTree = useDataStore(state => state.setShowGlobalTree)
  const isGlobalTreeCollapsed = useDataStore(state => state.showGlobalTree)

  function toggleGlobalTree() {
    setShowGlobalTree(!isGlobalTreeCollapsed)
  }

  return <div className="flex flex-row items-center bg-background px-2 md:px-4" data-cy="header">
    <Button data-cy="global-tree-toggle" variant="ghost" size="iconLg"
      className={`${!showGlobalTree ? 'hidden' : ''} mt-0.5 mr-2 -ml-2 shrink-0`}
      onClick={toggleGlobalTree}>
      { !isGlobalTreeCollapsed ? <Menu /> : <X /> }
    </Button>
    { title !== '' && <Title /> }
    <div className="ml-auto flex items-center gap-1 md:gap-2 shrink-0">
      { showAddNewPanelButton && <AddNewPanel /> }
      <Share />
      <Settings />
    </div>
  </div>
}

export default TopBar
