import { FC } from 'react'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { Badge } from '@/components/ui/badge.tsx'

interface Props {
  annotation: Annotation | null
}

const TooltipItem: FC<Props> = ({ annotation }) => {
  const { annotations: annotationsConfig } = useConfig()
  const type = (annotation.body as AnnotationBody)['x-content-type']
  const typeLabel = annotationsConfig?.types?.[type]?.label ?? type
  const content = (annotation.body as AnnotationBody).value

  return <div className="flex flex-col px-3 py-2 min-w-80 max-w-[380px] border border-border rounded-lg">
    <div className="flex align-start gap-4">
      <div
        className="overflow-hidden"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <Badge
        variant="accent"
        className="ml-auto self-start truncate group-hover:not-group-data-[selected]:invisible">
        {typeLabel}
      </Badge>
    </div>
  </div>
}

export default TooltipItem
