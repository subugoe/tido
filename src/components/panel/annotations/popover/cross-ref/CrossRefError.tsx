import { FC } from 'react'
import { CircleX } from 'lucide-react'
import { CustomError, translateError } from '@/utils/custom-error.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  error: CustomError
}
const CrossRefError: FC<Props> = ({ error }: Props) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
  const { title, message } = translateError(error, t)

  return <div className="max-w-xs flex flex-col items-center py-2 px-3 bg-red-50 dark:bg-red-300/20 rounded-lg">
    <CircleX className="text-red-500 mt-2" size="40" />
    <span className="mt-2 font-semibold text-red-900 dark:text-red-50 text-center break-words w-full">{ title }</span>
    <span className="mt-2 text-red-800/60 dark:text-red-50/50 text-center text-sm break-words w-full">{ message }</span>
  </div>
}

export default CrossRefError
