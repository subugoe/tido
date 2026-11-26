import { useRef } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'

// The number of annotations the panel shows. They are empty for a moment when navigating to another
// item, so the last final count is kept until the new one is known - otherwise it would flicker on every
// navigation.
export function useAnnotationsCount() {
  const { filteredAnnotations, annotationsPending } = usePanel()
  const count = useRef(0)
  if (!annotationsPending) count.current = filteredAnnotations.length
  return count.current
}
