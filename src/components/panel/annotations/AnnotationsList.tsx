import { FC } from 'react'

import Annotation from '@/components/panel/annotations/Annotation.tsx'

interface Props {
  filteredAnnotations: Annotation[]
}

const AnnotationsList: FC<Props> = ({ filteredAnnotations }) => {


  if (filteredAnnotations.length > 0) return <div className={`transition-opacity pt-4`}>
    {filteredAnnotations.map(a => <Annotation
      data={a}
      key={a.id}
    />)}
  </div>
}

export default AnnotationsList
