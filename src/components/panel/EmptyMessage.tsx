import { FC } from 'react'

const EmptyMessage: FC = () => {
  return (
    <div className="t-flex-1 t-flex t-items-center t-justify-center t-bg-gray-100 t-rounded-md">
      <span className="t-text-gray-600">This is an empty panel.</span>
    </div>
  )
}

export default EmptyMessage
