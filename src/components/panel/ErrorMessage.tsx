import { FC } from 'react'
import PanelContentWrapper from '@/components/panel/PanelShell.tsx'
import { Ban } from 'lucide-react'

interface ErrorProps {
  title?: string
  message: string | boolean
}

const ErrorMessage: FC<ErrorProps> = ({ title, message }) => {
  return (
    <PanelContentWrapper>
      <div className="flex-1 flex flex-col items-center rounded-md bg-muted p-3">
        <Ban className="text-muted-foreground/40 mt-[15vh]" size="60" />
        <span className="mt-4 font-semibold text-muted-foreground">{ title }</span>
        <span className="mt-2 text-muted-foreground text-center">{ message }</span>
      </div>
    </PanelContentWrapper>
  )
}
export default ErrorMessage
