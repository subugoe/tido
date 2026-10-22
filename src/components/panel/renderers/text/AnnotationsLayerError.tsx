import { FC, useEffect } from 'react'
import { useTextView } from '@/contexts/TextViewContext.tsx'
import { reportAnnotationError } from '@/utils/annotation-errors.ts'

interface Props {
  error: unknown
  source: string
}

// Shown in place of the annotations of a text when they failed in a way nothing else caught. It
// renders nothing: the text next to it stays as it is, only without its annotations, and the
// visitor is told about it in the text's warning bar.
const AnnotationsLayerError: FC<Props> = ({ error, source }) => {
  // null when the text is not rendered inside a text view (e.g. in the annotations sidebar)
  const textView = useTextView()

  useEffect(() => {
    reportAnnotationError(source, 'unexpected', error)
    textView?.addTextWarning('annotation_unexpected_error')
  }, [error])

  return null
}

export default AnnotationsLayerError
