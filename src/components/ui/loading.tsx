import { FC } from 'react'
import { LoaderCircle } from 'lucide-react'

interface Props {
  size?: number
}
const Loading: FC<Props> = ({ size = 16 }) => {
  return <div className="t-flex t-w-full t-h-full t-justify-center t-items-center"><LoaderCircle size={size} className="t-animate-spin t-text-gray-400" /></div>
}

export default Loading
