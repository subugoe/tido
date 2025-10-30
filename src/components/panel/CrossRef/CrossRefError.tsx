import { FC } from 'react'
import { CircleX } from 'lucide-react'
import { CustomError } from '@/contexts/PanelContext.tsx'
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu'

interface Props {
  error: CustomError
}
const CrossRefError: FC<Props> = ({ error }: Props) => {

  return  <DropdownMenuLabel className="max-w-xs">
    <div className="flex flex-col items-center py-2 px-3 bg-red-50 dark:bg-red-300/20 rounded-lg">
      <CircleX className="text-red-500 mt-2" size="40" />
      <span className="mt-2 font-semibold text-red-900 dark:text-red-50">{ error.name }</span>
      <span className="mt-2 text-red-800/60 dark:text-red-50/50 text-center text-sm">{ error.message }</span>
    </div>
  </DropdownMenuLabel>
}

export default CrossRefError
