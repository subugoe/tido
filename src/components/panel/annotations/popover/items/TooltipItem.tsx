import { FC } from 'react'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { getAnnotationType, getTextualBody } from '@/utils/annotation-data.ts'

interface Props {
  annotation: Annotation | null
}

const TooltipItem: FC<Props> = ({ annotation }) => {
  const { annotations: annotationsConfig } = useConfig()
  const type = getAnnotationType(annotation)
  const typeLabel = annotationsConfig?.types?.[type]?.label ?? type
  const content = getTextualBody(annotation)?.value

  return <div className="flex flex-col px-3 py-1.5 min-w-80 max-w-95 border border-border rounded-lg">
    <div className="flex align-start gap-4">
      <div
        className="overflow-hidden text-sm"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <Badge
        variant="muted"
        className="ml-auto self-start truncate group-hover:not-group-data-selected:invisible">
        {typeLabel}
      </Badge>
    </div>
  </div>
}

export default TooltipItem
