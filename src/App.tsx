import PanelsWrapper from './components/PanelsWrapper'
import { FC } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import SelectParallelPanels from '@/components/SelectParallelPanels.tsx'
import { configStore } from '@/store/ConfigStore.tsx'

import TopBar from '@/components/TopBar'

interface AppProps {
  customConfig: Config
}

const App: FC<AppProps> = ({ customConfig }) => {
  const addCustomConfig = configStore((state) => state.addCustomConfig)
  addCustomConfig(customConfig)

  return (
    <>
      <div className="tido">
        <div className="t-flex">
          <Popover>
            <PopoverTrigger className="open-tree-button t-h-8 t-w-10 t-relative">
              <span>Test</span>
            </PopoverTrigger>
            <PopoverContent>
              <SelectParallelPanels />
            </PopoverContent>
          </Popover>
          <TopBar />
        </div>
        <div className="t-flex-1 t-overflow-hidden">
          <PanelsWrapper />
        </div>
      </div>
    </>
  )
}

export default App
