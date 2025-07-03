import { FC, ReactNode } from 'react'

interface Props {
  children: ReactNode
}
const ScrollContainer: FC<Props> = ({ children }) => {
  return <div className="h-full overflow-y-auto relative">{ children }</div>
}

export default ScrollContainer
