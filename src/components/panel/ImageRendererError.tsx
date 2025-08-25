import  { FC } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { CircleX, RotateCcw } from 'lucide-react'
import PanelContentWrapper from '@/components/panel/PanelContentWrapper.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Button } from '@/components/ui/button.tsx'

const ImageRendererError: FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()


  return <div className="w-full h-full">
    <PanelContentWrapper>
      <div className="w-full overflow-hidden flex flex-col items-center py-3 px-8 bg-red-50 dark:bg-red-300/20 rounded-lg">
        <CircleX className="text-red-500 mt-[15vh]" size="60" />
        <span className="mt-4 font-semibold text-red-900 dark:text-red-50">{ t('no_image_available') }</span>
        <span className="mt-2 text-red-800/60 dark:text-red-50/50 text-center text-sm break-all">{ t(error) }</span>
        <Button variant="destructive" className="mt-8" onClick={() => resetErrorBoundary()}><RotateCcw /> { t('retry') }</Button>
      </div>
    </PanelContentWrapper>
  </div>
}

export default ImageRendererError
