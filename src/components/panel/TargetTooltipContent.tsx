import { FC, useEffect, useState } from 'react'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { getCrossRefInfo } from '@/utils/annotations.ts'
import TooltipAnnotation from '@/components/panel/annotations/TooltipAnnotation.tsx'
import CrossRefActionArea from '@/components/panel/CrossRefActionArea.tsx'
import TooltipNormalAnnotation from '@/components/panel/annotations/TooltipNormalAnnotation.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  crossRefAnnotations: Annotation[],
  relatedAnnotations: Annotation[]
  onClose: () => void
}


const TargetTooltipContent: FC<Props> = ({ crossRefAnnotations, relatedAnnotations, onClose }) => {

  const { usePanelTranslation } = usePanel()
  const { annotations: annotationsConfig } = useConfig()
  const { t } = usePanelTranslation()
  const tooltipTypes = annotationsConfig?.tooltipTypes ?? []

  const [crossRefInfos, setCrossRefInfos] = useState<CrossRefInfo[]>([])
  const tooltipAnnotations = relatedAnnotations.filter(a => tooltipTypes.includes((a.body as AnnotationBody)['x-content-type']))
  const normalAnnotations = relatedAnnotations.filter(a => !tooltipTypes.includes((a.body as AnnotationBody)['x-content-type']))

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
    return <p className="px-2 py-1.5 text-sm font-medium">{label}</p>
  }


  return (<div className="w-[95%]">
    {tooltipAnnotations.length > 0 && (
      <div className={crossRefInfos.length > 0 ? 'border-b-1 pb-1 border-muted-foreground mb-2' : ''}>
        {renderLabel(t('tooltip'))}
        {tooltipAnnotations.map((ta) => <div className="mb-2"><TooltipAnnotation key={ta.id} annotation={ta} /></div>)}
      </div>
    )}
    {crossRefInfos.length > 0 && <div className="mb-2">
      {renderLabel(t('reference'))}
      {crossRefInfos.map((info, i) => <div key={i} className="mb-1"><CrossRefActionArea crossRefInfo={info} onSelect={handleCrossRefSelection} /></div>)}
    </div>}
    {normalAnnotations.length > 0 && (
      <div className={(crossRefInfos.length > 0 || tooltipAnnotations.length > 0) ? 'border-t-1 pt-2 border-muted-foreground' : ''}>
        {renderLabel(t('sidebar'))}
        {normalAnnotations.map(na => <div className="mb-2"><TooltipNormalAnnotation key={na.id} annotation={na} /></div>)}
      </div>
    )}
  </div>
  )
}

export default TargetTooltipContent
