import { FC, useEffect, useRef, useState } from 'react'
import TooltipItem from '@/components/panel/annotations/popover/items/TooltipItem.tsx'
import CrossRefItem from '@/components/panel/annotations/popover/items/CrossRefItem.tsx'
import BaseItem from '@/components/panel/annotations/popover/items/BaseItem.tsx'
import SynopsisItem from '@/components/panel/annotations/popover/items/SynopsisItem.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { SyncTargets } from '@/store/SynopsisStore.tsx'

interface Props {
  target: Element,
  source: string
  crossRefAnnotations: Annotation[],
  relatedAnnotations: Annotation[]
  tooltipAnnotations: Annotation[]
  syncTargets: SyncTargets
  onClose: () => void,
  onBaseItemSelection?: () => void,
}


const AnnotationPopoverContent : FC<Props> = ({
  target,
  source,
  crossRefAnnotations,
  relatedAnnotations,
  tooltipAnnotations,
  syncTargets,
  onBaseItemSelection,
  onClose,
}) => {
  const { usePanelTranslation, panelId } = usePanel()
  const { t } = usePanelTranslation()

  const [loading, setLoading] = useState(true)

  const tooltipAnnotationsRef = useRef<Annotation[]>(null)
  const normalAnnotationsRef = useRef<Annotation[]>(null)

  const isSourceText = source.endsWith('.html')

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

    tooltipAnnotationsRef.current = tooltipAnnotations.sort(sortByDirectTarget)
    normalAnnotationsRef.current = relatedAnnotations.sort(sortByDirectTarget)

    setLoading(false)
  }, [target])


  function handleCrossRefSelection() {
    onClose()
  }

  function onBaseItemSelect(isSourceText: boolean) {
    // BaseItem's Popover is opened through target click in an Annotation
    if (!isSourceText) {
      onClose()
      onBaseItemSelection()
    }
  }


  function renderLabel(label: string) {
    return <p className="py-1 mb-1 text-xs font-medium text-muted-foreground">{label}</p>
  }

  if (loading) return <div>Loading ...</div>
  return <div
    className="flex flex-col gap-4"
    onClick={(e) => e.stopPropagation()}
  >
    {tooltipAnnotationsRef.current?.length > 0 && (
      <div className={crossRefAnnotations.length > 0 ? 'border-b border-border' : ''}>
        {renderLabel(t('tooltip'))}
        {tooltipAnnotationsRef.current?.map((ta) => <div className="mb-2"><TooltipItem key={ta.id} annotation={ta} /></div>)}
      </div>
    )}
    {crossRefAnnotations.length > 0 && <div className="flex flex-col gap-1">
      {renderLabel(t('reference'))}
      {crossRefAnnotations.map((annotation, i) => <CrossRefItem key={i} annotation={annotation} onSelect={handleCrossRefSelection} />)}
    </div>}
    {normalAnnotationsRef.current?.length > 0 && (
      <div className={`flex flex-col gap-2 ${(crossRefAnnotations.length > 0 || tooltipAnnotationsRef.current?.length > 0) ? 'border-t pt-2 border-border' : ''}`}>
        {renderLabel(tooltipAnnotationsRef.current?.length === 0 && crossRefAnnotations.length === 0 ? t('annotations') : t('more_annotations'))}
        {normalAnnotationsRef.current?.map(na => <BaseItem key={na.id} annotation={na} source={source} onSelect={() => onBaseItemSelect(isSourceText)}  />)}
      </div>
    )}
    {syncTargets?.targets.length > 0 && (
      <div className={`flex flex-col gap-1 ${(crossRefAnnotations.length > 0 || tooltipAnnotationsRef.current?.length > 0 || normalAnnotationsRef.current?.length > 0) ? 'border-t pt-2 border-border' : ''}`}>
        {renderLabel(t('synopsis'))}
        <SynopsisItem syncTargets={syncTargets} onSelect={() => onClose()} />
      </div>
    )}
  </div>
}

export default AnnotationPopoverContent
