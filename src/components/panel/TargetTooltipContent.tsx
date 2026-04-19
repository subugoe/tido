import { FC, useEffect, useState } from 'react'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { getCrossRefInfo } from '@/utils/annotations.ts'
import TooltipAnnotation from '@/components/panel/annotations/TooltipAnnotation.tsx'
import CrossRefActionArea from '@/components/panel/CrossRefActionArea.tsx'
import TooltipNormalAnnotation from '@/components/panel/annotations/TooltipNormalAnnotation.tsx'

interface Props {
  crossRefAnnotation: Annotation,
  relatedAnnotations: Annotation[]
  onClose: () => void
}


const TargetTooltipContent: FC<Props> = ({ crossRefAnnotation, relatedAnnotations, onClose }) => {

  const { annotations: annotationsConfig } = useConfig()
  const tooltipTypes = annotationsConfig?.tooltipTypes ?? []

  const [crossRefInfo, setCrossRefInfo] = useState<CrossRefInfo | null>(null)
  const tooltipAnnotations = relatedAnnotations.filter(a => tooltipTypes.includes((a.body as AnnotationBody)['x-content-type']))
  const normalAnnotations = relatedAnnotations.filter(a => !tooltipTypes.includes((a.body as AnnotationBody)['x-content-type']))

  function handleCrossRefSelection() {
    setCrossRefInfo(null)
    onClose()
  }

  useEffect(() => {
    async function computeCrossRefInfo(crossRefAnnotation: Annotation) {
      const crossRefInfo = await getCrossRefInfo(crossRefAnnotation)
      setCrossRefInfo(crossRefInfo)
    }

    if (crossRefAnnotation) computeCrossRefInfo(crossRefAnnotation)
  }, [crossRefAnnotation])


  return (<div className="w-[95%]">
    <div className={crossRefInfo && tooltipAnnotations.length > 0 ? 'border-b-1 pb-1 border-muted-foreground mb-2' : ''}>
      {tooltipAnnotations?.map((ta) => <div className="mb-2"><TooltipAnnotation key={ta.id} annotation={ta} /></div>)}
    </div>
    {crossRefInfo && <CrossRefActionArea crossRefInfo={crossRefInfo} onSelect={handleCrossRefSelection} />}
    <div className={(crossRefInfo || tooltipAnnotations.length > 0) && normalAnnotations.length > 0 ? 'border-t-1 pt-2 border-muted-foreground mb-2' : ''}>
      {normalAnnotations?.map(na => <div className="mb-2"><TooltipNormalAnnotation key={na.id} annotation={na} /></div>)}
    </div>
  </div>
  )
}

export default TargetTooltipContent
