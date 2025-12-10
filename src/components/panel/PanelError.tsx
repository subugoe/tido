import { FC } from 'react'
import { CircleX, RotateCcw } from 'lucide-react'
import { FallbackProps } from 'react-error-boundary'
import { CustomError } from '@/utils/custom-error.ts'
import { Button } from '@/components/ui/button.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
interface Props {
  error: CustomError
  resetErrorBoundary: () => void
}
const PanelError: FC<FallbackProps> = ({ error, resetErrorBoundary }: Props) => {
  const { usePanelTranslation, remove } = usePanel()
  const { t } = usePanelTranslation()

  return <div className="p-3 h-full flex">
    <div className="flex-1 flex flex-col items-center py-3 px-8 bg-red-50 dark:bg-red-300/20 rounded-lg">
      <CircleX className="text-red-500 mt-[15vh]" size="60" />
      <span className="mt-4 font-semibold text-red-900 dark:text-red-50">{error.name}</span>
      <span className="mt-2 text-red-800/60 dark:text-red-50/50 text-center text-sm break-all">{error.message}</span>
      <div className="flex gap-2">
        <Button variant="destructive" className="mt-8" onClick={() => resetErrorBoundary()}><RotateCcw /> { t('retry') }</Button>
        <Button variant="destructive" className="mt-8" onClick={remove}><CircleX /> { t('close_panel') }</Button>
      </div>
    </div>
  </div>
}

export default PanelError
