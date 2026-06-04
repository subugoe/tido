import { FC, useEffect, useRef, useState } from 'react'
import { getCrossRefInfos } from '@/utils/annotations.ts'
import { CustomError } from '@/utils/custom-error.ts'
import TooltipItem from '@/components/panel/annotations/popover/items/TooltipItem.tsx'
import CrossRefItem from '@/components/panel/annotations/popover/items/CrossRefItem.tsx'
import BaseItem from '@/components/panel/annotations/popover/items/BaseItem.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  target: Element,
  source: string
  crossRefAnnotations: Annotation[],
  relatedAnnotations: Annotation[]
  tooltipAnnotations: Annotation[]
  onClose: () => void
}


const AnnotationPopoverContent: FC<Props> = ({
  target,
  source,
  crossRefAnnotations,
  relatedAnnotations,
  tooltipAnnotations,
  onClose,
}) => {
  const { usePanelTranslation, panelId } = usePanel()
  const { t } = usePanelTranslation()

  const [crossRefInfos, setCrossRefInfos] = useState<CrossRefInfo[]>([])
  const [crossRefErrors, setCrossRefErrors] = useState<CustomError[]>([])
  const [loading, setLoading] = useState(true)

  const tooltipAnnotationsRef = useRef<Annotation[]>(null)
  const normalAnnotationsRef = useRef<Annotation[]>(null)

  useEffect(() => {
    const panelEl = panelId ? document.getElementById(panelId) : null
    const deepestTargetAnnotation = (annotation: Annotation) =>
      annotation.target.some(t => Array.from(panelEl?.querySelectorAll((t.selector as CssSelector).value)
        ?? []).includes(target as Element))

    function sortByDirectTarget(a: Annotation, b: Annotation) {
      if (deepestTargetAnnotation(a) && !deepestTargetAnnotation(b)) return -1
      if (!deepestTargetAnnotation(a) && deepestTargetAnnotation(b)) return 1
      return 0
    }

    async function computeCrossRefInfos(annotations: Annotation[]) {
      const results = await getCrossRefInfos(annotations)

      setCrossRefInfos(results.filter((r): r is CrossRefInfo => !(Object.hasOwn(r, 'name') && Object.hasOwn(r, 'message'))))
      setCrossRefErrors(results.filter((r): r is CustomError => Object.hasOwn(r, 'name') && Object.hasOwn(r, 'message')))
    }

    tooltipAnnotationsRef.current = tooltipAnnotations.sort(sortByDirectTarget)
    normalAnnotationsRef.current = relatedAnnotations.sort(sortByDirectTarget)

    setLoading(false)
    computeCrossRefInfos(crossRefAnnotations)
  }, [target])


  function handleCrossRefSelection() {
    setCrossRefInfos([])
    onClose()
  }


  function renderLabel(label: string) {
    return <p className="py-1 mb-1 text-xs font-medium text-muted-foreground">{label}</p>
  }

  if (loading) return <div>Loading ...</div>
  return <div className="flex flex-col gap-4">
    {tooltipAnnotationsRef.current?.length > 0 && (
      <div className={crossRefInfos.length > 0 ? 'border-b border-border' : ''}>
        {renderLabel(t('tooltip'))}
        {tooltipAnnotationsRef.current?.map((ta) => <div className="mb-2"><TooltipItem key={ta.id} annotation={ta} /></div>)}
      </div>
    )}
    {(crossRefInfos.length > 0 || crossRefErrors.length > 0) && <div className="flex flex-col gap-1">
      {renderLabel(t('reference'))}
      {crossRefInfos.map((info, i) => <CrossRefItem key={i} crossRefInfo={info} onSelect={handleCrossRefSelection} />)}
      {crossRefErrors.map((error, i) => <CrossRefItem key={`error-${i}`} crossRefError={error} onSelect={handleCrossRefSelection} />)}
    </div>}
    {normalAnnotationsRef.current?.length > 0 && (
      <div className={`flex flex-col gap-2 ${(crossRefInfos.length > 0 || tooltipAnnotationsRef.current?.length > 0) ? 'border-t pt-2 border-border' : ''}`}>
        {renderLabel(tooltipAnnotationsRef.current?.length === 0 && crossRefInfos.length === 0 ? t('annotations') : t('more_annotations'))}
        {normalAnnotationsRef.current?.map(na => <BaseItem key={na.id} annotation={na} source={source} />)}
      </div>
    )}
  </div>
}

export default AnnotationPopoverContent
