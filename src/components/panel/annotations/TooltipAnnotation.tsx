import { FC } from 'react'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { Badge } from '@/components/ui/badge.tsx'

interface Props {
  annotation: Annotation | null
}

const TooltipAnnotation: FC<Props> = ({ annotation }) => {
  const { annotations: annotationsConfig } = useConfig()
  const type = (annotation.body as AnnotationBody)['x-content-type']
  const typeLabel = annotationsConfig?.types?.[type]?.label ?? type
  const content = (annotation.body as AnnotationBody).value


  return (
    <div className="flex flex-col h-20 pt-2 rounded-lg border border-border bg-muted">
      <div className="px-3 pb-2">
        <Badge variant="accent" className="mb-1">{typeLabel}</Badge>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  )
}

export default TooltipAnnotation
