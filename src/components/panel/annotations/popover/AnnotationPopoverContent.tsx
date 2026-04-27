import { FC, useEffect, useState } from 'react'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { getCrossRefInfo } from '@/utils/annotations.ts'
import TooltipItem from '@/components/panel/annotations/popover/items/TooltipItem.tsx'
import CrossRefItem from '@/components/panel/annotations/popover/items/CrossRefItem.tsx'
import BaseItem from '@/components/panel/annotations/popover/items/BaseItem.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  target: HTMLElement | null,
  crossRefAnnotations: Annotation[],
  relatedAnnotations: Annotation[]
  onClose: () => void
}


const AnnotationPopoverContent: FC<Props> = ({ target,crossRefAnnotations, relatedAnnotations, onClose }) => {

  const { usePanelTranslation, panelId } = usePanel()
  const { annotations: annotationsConfig } = useConfig()
  const { t } = usePanelTranslation()
  const tooltipTypes = annotationsConfig?.tooltipTypes ?? []

  const [crossRefInfos, setCrossRefInfos] = useState<CrossRefInfo[]>([])

  const panelEl = panelId ? document.getElementById(panelId) : null
  const deepestTargetAnnotation = (annotation: Annotation) =>
    annotation.target.some(t => panelEl?.querySelector((t.selector as CssSelector).value) === target)

  function sortByDirectTarget(a: Annotation, b: Annotation) {
    if (deepestTargetAnnotation(a) && !deepestTargetAnnotation(b)) return -1
    if (!deepestTargetAnnotation(a) && deepestTargetAnnotation(b)) return 1
    return 0
  }

  const tooltipAnnotations = relatedAnnotations
    .filter(a => tooltipTypes.includes((a.body as AnnotationBody)['x-content-type']))
    .sort(sortByDirectTarget)
  const normalAnnotations = relatedAnnotations
    .filter(a => !tooltipTypes.includes((a.body as AnnotationBody)['x-content-type']))
    .sort(sortByDirectTarget)

  function handleCrossRefSelection() {
    setCrossRefInfos([])
    onClose()
  }

  useEffect(() => {
    async function computeCrossRefInfos(annotations: Annotation[]) {
      const infos: CrossRefInfo[] = await Promise.all(annotations.map(a => getCrossRefInfo(a)))
      setCrossRefInfos(infos)
    }
    computeCrossRefInfos(crossRefAnnotations)
  }, [crossRefAnnotations])

  function renderLabel(label: string) {
    return <p className="py-1 mb-1 text-xs font-medium text-muted-foreground">{label}</p>
  }

  return <div className="flex flex-col gap-4">
    {tooltipAnnotations.length > 0 && (
      <div className={crossRefInfos.length > 0 ? 'border-b border-border' : ''}>
        {renderLabel(t('tooltip'))}
        {tooltipAnnotations.map((ta) => <div className="mb-2"><TooltipItem key={ta.id} annotation={ta} /></div>)}
      </div>
    )}
    {crossRefInfos.length > 0 && <div className="flex flex-col gap-1">
      {renderLabel(t('reference'))}
      {crossRefInfos.map((info, i) => <CrossRefItem key={i} crossRefInfo={info} onSelect={handleCrossRefSelection} />)}
    </div>}
    {normalAnnotations.length > 0 && (
      <div className={`flex flex-col gap-2 ${(crossRefInfos.length > 0 || tooltipAnnotations.length > 0) ? 'border-t pt-2 border-border' : ''}`}>
        {renderLabel(tooltipAnnotations.length === 0 && crossRefInfos.length === 0 ? t('annotations') : t('more_annotations'))}
        {normalAnnotations.map(na => <BaseItem key={na.id} annotation={na} />)}
      </div>
    )}
  </div>
}

export default AnnotationPopoverContent
