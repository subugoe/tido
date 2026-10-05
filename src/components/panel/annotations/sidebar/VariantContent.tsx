import React, { FC } from 'react'
import WitnessChip from '@/components/panel/annotations/sidebar/WitnessChip.tsx'
import GenericTextRenderer from '@/components/panel/renderers/text/GenericTextRenderer.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { getTextualBody } from '@/utils/annotation-data.ts'

interface Props {
  annotation: Annotation
  onSelect?: () => void
  onUpdateMatchedAnnotationsMap?: (map: MatchedAnnotationsMap) => void
}

const VariantContent: FC<Props> = React.memo(({ annotation, onSelect, onUpdateMatchedAnnotationsMap }) => {
  const { value, witnesses = [] } = getTextualBody(annotation) ?? {}
  const { activeAnnotationTypes } = usePanel()

  const filteredWitnesses = activeAnnotationTypes && activeAnnotationTypes['Variant']
    ? witnesses.filter(witness => activeAnnotationTypes['Variant'].includes(witness))
    : witnesses

  return <div className="flex">
    <div>
      <GenericTextRenderer
        htmlString={value}
        source={annotation.id}
        sourceType="annotation"
        ignoreFilters={true}
        onSelect={onSelect}
        onUpdateMatchedAnnotationsMap={onUpdateMatchedAnnotationsMap}
      />
    </div>
    <div className="ml-auto flex gap-1">
      {filteredWitnesses.map((witness, i) => <WitnessChip idno={witness} key={'witness' + i} />)}
    </div>
  </div>
})

export default VariantContent
