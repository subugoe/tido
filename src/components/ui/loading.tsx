import { FC } from 'react'
import { Ellipsis } from 'lucide-react'

interface Props {
  size?: number
}

const Loading: FC<Props> = ({ size = 16 }) => {
  return <div
    role="status"
    aria-label="Loading"
    className="flex w-full h-full justify-center items-center"
  >
    <Ellipsis size={size} className="loading text-gray-400" />
  </div>
}

export default Loading
