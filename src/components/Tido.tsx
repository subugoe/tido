import { FC, Suspense, useEffect } from 'react'

import RailSidebar from '@/components/rail/RailSidebar.tsx'

import PanelsWrapper from '@/components/PanelsWrapper.tsx'
import { TidoProps } from '@/types'
import { ThemeProvider } from '@/contexts/ThemeContext.tsx'
import { Toaster } from 'sonner'
import { ConfigProvider } from '@/contexts/ConfigContext.tsx'
import Loading from '@/components/ui/loading.tsx'
import { useUIStore } from '@/store/UIStore.tsx'


export const Tido: FC<TidoProps> = ({ config: customConfig, theme, onReady, onThemeChange }) => {

  const { updateTheme } = useUIStore()

  function dataLoaded() {
    if (onReady) onReady()
  }

  useEffect(() => {
    if (theme) updateTheme(theme)
  }, [theme])


  return (
    <div className="tido flex flex-col h-full" data-cy="app">
      <div className="flex flex-col bg-muted h-full rounded-2xl">
        <ThemeProvider  onThemeChange={onThemeChange}>
          <Suspense fallback={<Loading />}>
            <ConfigProvider userConfig={customConfig}>
              <div className="flex-1 flex overflow-hidden">
                <RailSidebar />
                <PanelsWrapper onPanelsLoaded={dataLoaded} />
                <Toaster position="bottom-center" richColors expand={true}  />
              </div>
            </ConfigProvider>
          </Suspense>
        </ThemeProvider>
      </div>
    </div>
  )
}
