import { FC, useEffect, useRef, useState } from 'react'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { getCrossRefInfo } from '@/utils/annotations.ts'
import TooltipItem from '@/components/panel/annotations/popover/items/TooltipItem.tsx'
import CrossRefItem from '@/components/panel/annotations/popover/items/CrossRefItem.tsx'
import BaseItem from '@/components/panel/annotations/popover/items/BaseItem.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  target: Element,
  crossRefAnnotations: Annotation[],
  relatedAnnotations: Annotation[]
  onClose: () => void
}


const AnnotationPopoverContent: FC<Props> = ({ target, crossRefAnnotations, relatedAnnotations, onClose }) => {

  const { annotations: annotationsConfig } = useConfig()
  const { usePanelTranslation, panelId } = usePanel()
  const { t } = usePanelTranslation()
  const tooltipTypes = annotationsConfig?.tooltipTypes ?? []

  const [crossRefInfos, setCrossRefInfos] = useState<CrossRefInfo[]>([])
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
      const infos: CrossRefInfo[] = await Promise.all(annotations.map(a => getCrossRefInfo(a))) as CrossRefInfo[]
      setCrossRefInfos(infos)
    }

    tooltipAnnotationsRef.current = relatedAnnotations.filter(a =>
      tooltipTypes.includes((a.body as AnnotationBody)['x-content-type'])).sort(sortByDirectTarget)
    normalAnnotationsRef.current = relatedAnnotations.filter(a =>
      !tooltipTypes.includes((a.body as AnnotationBody)['x-content-type'])).sort(sortByDirectTarget)

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
    {crossRefInfos.length > 0 && <div className="flex flex-col gap-1">
      {renderLabel(t('reference'))}
      {crossRefInfos.map((info, i) => <CrossRefItem key={i} crossRefInfo={info} onSelect={handleCrossRefSelection} />)}
    </div>}
    {normalAnnotationsRef.current?.length > 0 && (
      <div className={`flex flex-col gap-2 ${(crossRefInfos.length > 0 || tooltipAnnotationsRef.current?.length > 0) ? 'border-t pt-2 border-border' : ''}`}>
        {renderLabel(tooltipAnnotationsRef.current?.length === 0 && crossRefInfos.length === 0 ? t('annotations') : t('more_annotations'))}
        {normalAnnotationsRef.current?.map(na => <BaseItem key={na.id} annotation={na} />)}
      </div>
    )}
  </div>
}

export default AnnotationPopoverContent
