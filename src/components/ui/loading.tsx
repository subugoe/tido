import { FC } from 'react'
import { LoaderCircle } from 'lucide-react'

interface Props {
  size?: number
}
const Loading: FC<Props> = ({ size = 16 }) => {
  return <div className="flex w-full h-full justify-center items-center"><LoaderCircle size={size} className="animate-spin text-gray-400" /></div>
}

export default Loading
