import { FC, Suspense } from 'react'

import TopBar from '@/components/header/TopBar.tsx'
import GlobalTree from '@/components/tree/GlobalTree.tsx'

import PanelsWrapper from '@/components/PanelsWrapper.tsx'
import { TidoProps } from '@/types'
import { ThemeProvider } from '@/contexts/ThemeContext.tsx'
import { Toaster } from 'sonner'
import { ConfigProvider } from '@/contexts/ConfigContext.tsx'
import Loading from '@/components/ui/loading.tsx'


export const Tido: FC<TidoProps> = ({ config: customConfig }) => {

  function dataLoaded(numberPanels: number) {
    console.log('number of panels loaded', numberPanels)
  }


  return (
    <div className="tido flex flex-col h-full" data-cy="app">
      <ThemeProvider>
        <Suspense fallback={<Loading size={36} />}>
          <ConfigProvider userConfig={customConfig}>
            <TopBar />
            <div className="flex-1 flex overflow-hidden">
              <GlobalTree />
              <PanelsWrapper onPanelsLoaded={dataLoaded} />
              <Toaster position="bottom-center" richColors expand={true}  />
            </div>
          </ConfigProvider>
        </Suspense>
      </ThemeProvider>
    </div>
  )
}
