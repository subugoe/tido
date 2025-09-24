import  { FC } from 'react'
import AnnotationFilters from '@/components/panel/annotations/AnnotationFilters.tsx'
import AnnotationsModeToggle from '@/components/panel/annotations/AnnotationsModeToggle.tsx'

const AnnotationsHeader: FC = () => {
  return <div data-cy="annotations-header" className="flex flex-col items-center p-3">
    <div className="absolute top-1 right-1">
      <AnnotationsModeToggle />
    </div>
    <AnnotationFilters />
  </div>
}

export default AnnotationsHeader
