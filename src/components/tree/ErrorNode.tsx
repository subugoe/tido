import { FC } from 'react'
import { CircleX, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { useTranslation } from 'react-i18next'

interface Props {
  onRetry: () => Promise<void>
}

const ErrorNode: FC<Props> = ({ onRetry }) => {
  const { t } = useTranslation()


  return <div className="flex flex-col p-2 ml-12 rounded-xl">
    <span className="mb-2 flex">
      <CircleX className="text-red-500 mr-2" size="20" />
      <span data-cy="error-node" className="text-red-800/60 dark:text-red-50/50">{t('could_not_load_data')}</span>
    </span>
    <Button variant="destructive" className="w-[65%] active:scale-95 transition duration-150 ease-in-out" onClick={onRetry}><RotateCcw /> { t('retry') }</Button>
  </div>
}

export default ErrorNode
