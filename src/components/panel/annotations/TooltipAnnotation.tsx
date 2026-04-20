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

  return <div className="flex flex-col px-3 py-2 min-w-80 border border-border rounded-lg">
    <div className="flex gap-4">
      <div
        className="whitespace-nowrap truncate overflow-hidden"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <Badge
        variant="accent"
        className="ml-auto truncate group-hover:not-group-data-[selected]:invisible">
        {typeLabel}
      </Badge>
    </div>
  </div>
}

export default TooltipAnnotation
