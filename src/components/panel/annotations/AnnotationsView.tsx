import { FC } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import AlignAnnotationsList from '@/components/panel/annotations/AlignAnnotationsList.tsx'
import AnnotationsList from '@/components/panel/annotations/AnnotationsList.tsx'


const AnnotationsView: FC = () => {
  const { annotationsMode } = usePanel()

  if (annotationsMode === 'align') return <AlignAnnotationsList />
  return <AnnotationsList />
}

export default AnnotationsView
