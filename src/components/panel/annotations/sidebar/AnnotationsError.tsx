import { FC } from 'react'
import { CustomError, translateError } from '@/utils/custom-error.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { CircleX } from 'lucide-react'

interface Props {
  error: CustomError
  resetErrorBoundary: () => void
}
const AnnotationsError: FC<Props> = ({ error }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
  const { title, message } = translateError(error, t)

  return <div className="flex-1 flex flex-col items-center m-3 py-3 px-8 bg-red-50 dark:bg-red-300/20 rounded-lg">
    <CircleX className="text-red-500 mt-[15vh]" size="60" />
    <span className="mt-4 font-semibold text-red-900 dark:text-red-50">{title}</span>
    <span className="mt-2 text-red-800/60 dark:text-red-50/50 text-center text-sm break-all">{message}</span>
  </div>
}

export default AnnotationsError
