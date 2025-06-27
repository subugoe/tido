import { FC } from 'react'
import AnnotationsHeader from '@/components/panel/annotations/AnnotationsHeader.tsx'
import AnnotationsBody from '@/components/panel/annotations/AnnotationsBody.tsx'

const Annotations: FC = () => {
  return <div className="flex flex-col h-full">
    <AnnotationsHeader />
    <AnnotationsBody />
  </div>
}

export default Annotations
