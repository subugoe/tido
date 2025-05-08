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
      <div className="flex-1 flex flex-col items-center rounded-md bg-gray-100 p-3">
        <Ban className="text-gray-300 mt-[15vh]" size="60" />
        <span className="mt-4 font-semibold text-gray-600">{ title }</span>
        <span className="mt-2 text-gray-600 text-center">{ message }</span>
      </div>
    </PanelContentWrapper>
  )
}
export default ErrorMessage
