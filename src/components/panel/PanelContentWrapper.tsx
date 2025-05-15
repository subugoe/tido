import { FC, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}
const PanelContentWrapper: FC<Props> = ({ children }) => {
  return <div className="w-full h-full flex p-3">{ children }</div>
}

export default PanelContentWrapper
