import { FC } from 'react'
import PanelContentWrapper from '@/components/panel/PanelContentWrapper.tsx'
import { Ban } from 'lucide-react'

interface ErrorProps {
  title?: string
  message: string | boolean
}

const ErrorMessage: FC<ErrorProps> = ({ title, message }) => {
  return (
    <PanelContentWrapper>
      <div className="t-flex-1 t-flex t-flex-col t-items-center t-rounded-md t-bg-gray-100 t-p-3">
        <Ban className="t-text-gray-300 t-mt-[15vh]" size="60" />
        <span className="t-mt-4 t-font-semibold t-text-gray-600">{ title }</span>
        <span className="t-mt-2 t-text-gray-600 t-text-center">{ message }</span>
      </div>
    </PanelContentWrapper>
  )
}
export default ErrorMessage
