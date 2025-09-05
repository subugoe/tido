import { FC } from 'react'

interface Props {
  label: string
}

const EmptyNode: FC<Props> = ({ label }) => {


  return <div className="mt-2 ml-12">
    <span data-cy="empty-node">{label}</span>
  </div>
}

export default EmptyNode
