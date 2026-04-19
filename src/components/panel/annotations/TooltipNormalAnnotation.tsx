import { FC, useEffect, useRef } from 'react'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  annotation: Annotation | null
}

const TooltipNormalAnnotation: FC<Props> = ({ annotation }) => {
  const { annotations: annotationsConfig } = useConfig()
  const { updatePanel } = usePanel()

  const ref = useRef<HTMLDivElement>(null)

  const type = (annotation.body as AnnotationBody)['x-content-type']
  const typeLabel = annotationsConfig?.types?.[type]?.label ?? type
  const content = (annotation.body as AnnotationBody).value

  function handleSelection() {
    updatePanel({ selectedAnnotation: annotation })
  }

  useEffect(() => {
    if (!ref.current || !content) return
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const full = doc.body.innerText
    ref.current.textContent = full.length > 50 ? full.slice(0, 50) + '...' : full
  }, [content])

  return (
    <div className="flex flex-col pt-2 rounded-lg border border-border bg-muted hover:border-primary hover:cursor-pointer" onClick={handleSelection}>
      <div className="px-3 pb-2">
        <Badge variant="accent" className="mb-1">{typeLabel}</Badge>
        <div ref={ref} />
      </div>
    </div>
  )
}

export default TooltipNormalAnnotation
