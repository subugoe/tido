import { FC } from 'react'
import { CustomError } from '@/utils/custom-error.ts'
import { CircleX } from 'lucide-react'

interface Props {
  error: CustomError
}
const AnnotationsError: FC<Props> = ({ error }) => {
  return <div className="-mx-3 h-full flex">
    <div className="flex-1 flex flex-col items-center py-3 px-8 bg-red-50 dark:bg-red-300/20 rounded-lg">
      <CircleX className="text-red-500 mt-[15vh]" size="60" />
      <span className="mt-4 font-semibold text-red-900 dark:text-red-50">{error.name}</span>
      <span className="mt-2 text-red-800/60 dark:text-red-50/50 text-center text-sm break-all">{error.message}</span>
    </div>
  </div>
}

export default AnnotationsError
