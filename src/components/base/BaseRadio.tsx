import { FC } from 'react'
import { Circle } from 'lucide-react'
import { cn } from '@/lib/utils.ts'

interface Props {
  checked?: boolean
  className?: string
}
const BaseRadio: FC<Props> = ({ checked = false, className }) => {
  return <div
    className={cn(
      `flex items-center justify-center aspect-square h-4 w-4 rounded-full border-2 border-gray-300
      group-hover:border-primary group-hover:text-primary ${checked ? 'border-primary text-primary' : ''}
      ring-offset-white`,
      className)}
  >
    <Circle className={`h-2.5 w-2.5 fill-current text-current opacity-0 group-hover:opacity-100 transition-all ${checked ? 'opacity-100' : '' }`} />
  </div>
}

export default BaseRadio
