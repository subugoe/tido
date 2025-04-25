import { FC, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}
const PanelContentWrapper: FC<Props> = ({ children }) => {
  return <div className="t-w-full t-h-full t-flex t-p-3">{ children }</div>
}

export default PanelContentWrapper
