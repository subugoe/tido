import { FC, useEffect, useState } from 'react'
import { CircleX } from 'lucide-react'
import { FallbackProps } from 'react-error-boundary'
import { CustomError } from '@/contexts/PanelContext.tsx'
import { PanelResizer } from '@/utils/panel-resizer.ts'

interface Props {
  error: CustomError
  resetErrorBoundary: () => void
}
const PanelError: FC<FallbackProps> = ({ error }: Props) => {

  const [width, setWidth] = useState(null)

  useEffect(() => {
    const wrapper = document.getElementById('panels-wrapper')
    setWidth(PanelResizer.calculateWidth(wrapper))
  }, [])

  return <div className="panel overflow-hidden grow-0 shrink-0 border-2 border-border rounded-lg p-3" style={{ width }} >
    <div className="h-full flex flex-col items-center py-3 px-8 bg-red-50 dark:bg-red-300/20 rounded-lg">
      <CircleX className="text-red-500 mt-[15vh]" size="60" />
      <span className="mt-4 font-semibold text-red-900 dark:text-red-50">{ error.name }</span>
      <span className="mt-2 text-red-800/60 dark:text-red-50/50 text-center text-sm break-all">{ error.message }</span>
    </div>
  </div>
}

export default PanelError
