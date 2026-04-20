import { FC, useEffect, useState } from 'react'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import { MoveRight } from 'lucide-react'

interface Props {
  annotation: Annotation | null
}

const TooltipNormalAnnotation: FC<Props> = ({ annotation }) => {
  const { annotations: annotationsConfig } = useConfig()
  const { updatePanel, selectedAnnotation, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  const [text, setText] = useState('')

  const type = (annotation.body as AnnotationBody)['x-content-type']
  const typeLabel = annotationsConfig?.types?.[type]?.label ?? type
  const content = (annotation.body as AnnotationBody).value
  const isSelected = selectedAnnotation?.id === annotation.id

  function handleSelection() {
    updatePanel({ selectedAnnotation: isSelected ? null : annotation, showSidebar: true })
  }

  useEffect(() => {
    if (!content) return
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    setText(doc.body.innerText)
  }, [content])

  return (
    <div
      className={`relative group flex flex-col px-3 py-2 min-w-80 max-w-[380px] rounded-lg border border-border hover:cursor-pointer
        ${isSelected ? 'shadow-md bg-background outline-primary outline-2' : 'hover:border-primary'}`}
      {...(isSelected ? { 'data-selected': '' } : {})}
      onClick={handleSelection}
    >
      <div className="flex gap-4">
        <div className="whitespace-nowrap truncate overflow-hidden">{text}</div>
        <Badge variant="accent" className="ml-auto truncate group-hover:not-group-data-[selected]:invisible">{typeLabel}</Badge>
        <Button size="xs" className="absolute top-2 right-3 hidden group-hover:not-group-data-[selected]:flex">
          {t('show_in_sidebar')} <MoveRight />
        </Button>
      </div>
    </div>
  )
}

export default TooltipNormalAnnotation
