import PanelsWrapper from './components/PanelsWrapper'
import { FC } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import SelectParallelPanels from '@/components/SelectParallelPanels.tsx'
import { configStore } from '@/store/ConfigStore.tsx'

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
            <PopoverContent className="t-bg-white t-absolute t-z-10">
              <div
                className="t-flex t-flex-col t-pt-4 t-pl-3 t-w-80 t-shadow-md t-border-[1px] t-border-solid t-border-gray-300 t-rounded-md">
                <SelectParallelPanels />
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="t-flex-1 t-overflow-hidden">
          <PanelsWrapper />
        </div>
      </div>
    </>
  )
}

export default App
