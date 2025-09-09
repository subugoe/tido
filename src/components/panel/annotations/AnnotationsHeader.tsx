import  { FC } from 'react'
import AnnotationFilters from '@/components/panel/annotations/AnnotationFilters.tsx'

const AnnotationsHeader: FC = () => {
  return <div data-cy="annotations-header" className="flex flex-col items-center p-3">
    <AnnotationFilters />
  </div>
}

export default AnnotationsHeader
