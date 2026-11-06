import { FC, ReactElement, useId, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useIsAnnotationHovered, useSetHoveredAnnotations } from '@/contexts/TextContext.tsx'
import GenericTextRenderer from '@/components/panel/renderers/text/GenericTextRenderer.tsx'
import VariantContent from '@/components/panel/annotations/sidebar/VariantContent.tsx'
import { getAnnotationType, getTextualBody } from '@/utils/annotation-data.ts'
import { getTextLetter } from '@/utils/aligned-layout.ts'
import { cn } from '@/lib/utils.ts'
import { getAnnotationLabel, Origin, useTypeLabel } from '@/components/panel/annotations/sidebar/aligned/shared.tsx'

// From this many characters on a note is cut after six lines and can be shown in full on demand.
export const LONG_NOTE_LENGTH = 320

export interface WorkbenchRowContext {
  // the sub-annotations of an annotation, in data order
  childrenOf: (annotationId: string) => Annotation[]
  showOrigin: boolean
  // the text an annotation of the column belongs to, by panel order - undefined for sub-annotations
  textIndexOf: (annotationId: string) => number | undefined
}

// The note of an annotation, rendered the way the annotation card renders it - targets of
// sub-annotations and cross references in it work the same.
const Note: FC<{ annotation: Annotation }> = ({ annotation }) => {
  const { t } = useTranslation()
  const [full, setFull] = useState(false)
  const id = useId()
  const isLong = useMemo(() => getAnnotationLabel(annotation).length >= LONG_NOTE_LENGTH, [annotation])
  const isVariant = getAnnotationType(annotation) === 'Variant'
  const clamped = isLong && !full

  return <div>
    <div
      id={id}
      data-workbench-note
      // six lines of text-sm - the note is markup of any shape, so its height is cut, not its lines
      className={cn('text-sm', clamped && 'max-h-30 overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent)]')}
    >
      {isVariant
        ? <VariantContent annotation={annotation} />
        : <GenericTextRenderer htmlString={getTextualBody(annotation)?.value} source={annotation.id} sourceType="annotation" ignoreFilters={true} />}
    </div>
    {isLong && <button
      type="button"
      aria-expanded={full}
      aria-controls={id}
      onClick={() => setFull(!full)}
      className="mt-1 text-xs font-medium text-primary hover:underline cursor-pointer"
    >
      {full ? t('show_short_note') : t('show_full_note')}
    </button>}
  </div>
}

interface Props {
  annotation: Annotation
  // 0 for an annotation of the column, 1 for its sub-annotations and so on
  level: number
  expanded: boolean
  context: WorkbenchRowContext
  onToggle: () => void
  // the rows below this one, rendered by the caller so it can decide what is open down the path
  renderChild: (child: Annotation) => ReactElement
}

// One annotation on the workbench: a header that expands its metadata, note and sub-annotations.
const WorkbenchRow: FC<Props> = ({ annotation, level, expanded, context, onToggle, renderChild }) => {
  const { t } = useTranslation()
  const { selectedAnnotation } = usePanel()
  const setHoveredAnnotations = useSetHoveredAnnotations()
  const isHovered = useIsAnnotationHovered(annotation.id)
  const getTypeLabel = useTypeLabel()
  const bodyId = useId()

  const typeLabel = getTypeLabel(annotation)
  const label = useMemo(() => getAnnotationLabel(annotation), [annotation])
  const children = context.childrenOf(annotation.id)
  const textIndex = context.textIndexOf(annotation.id)
  const isSelected = selectedAnnotation?.annotation?.id === annotation.id

  return <li data-workbench-row={annotation.id} className={cn(level > 0 && 'border-l-2 border-border pl-2')}>
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls={bodyId}
      aria-pressed={isSelected}
      aria-label={`${typeLabel}: ${label}`}
      onClick={onToggle}
      onMouseEnter={() => setHoveredAnnotations([annotation.id])}
      onMouseLeave={() => setHoveredAnnotations(null)}
      className={cn(
        'flex w-full min-h-8 items-center gap-2 rounded-md px-1.5 text-left text-sm cursor-pointer hover:bg-muted',
        'focus-visible:outline-2 focus-visible:outline-primary',
        isSelected && 'bg-muted font-medium',
        isHovered && 'text-primary'
      )}
    >
      {expanded ? <ChevronDown size={14} aria-hidden className="shrink-0" /> : <ChevronRight size={14} aria-hidden className="shrink-0" />}
      <span aria-hidden className="shrink-0 text-xs text-muted-foreground">{typeLabel}</span>
      <span aria-hidden className={cn('min-w-0 flex-1', !expanded && 'truncate')}>{expanded ? '' : label}</span>
      <span aria-hidden className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
        {children.length > 0 && <span>↳ {children.length}</span>}
        {context.showOrigin && textIndex !== undefined && <Origin textIndex={textIndex} />}
      </span>
    </button>

    {expanded && <div id={bodyId} className="flex flex-col gap-2 px-1.5 pb-2 pt-1">
      <dl className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
        <div className="flex gap-1"><dt>{t('annotation_type')}:</dt><dd>{typeLabel}</dd></div>
        {context.showOrigin && textIndex !== undefined && <div className="flex gap-1">
          <dt className="sr-only">{t('text')}:</dt><dd>{t('text_origin', { letter: getTextLetter(textIndex) })}</dd>
        </div>}
      </dl>

      <Note annotation={annotation} />

      {children.length > 0 && <section>
        <h4 className="mb-1 text-xs font-medium text-muted-foreground">{t('sub_annotations_list', { count: children.length })}</h4>
        <ul className="flex flex-col gap-0.5">
          {children.map((child) => renderChild(child))}
        </ul>
      </section>}
    </div>}
  </li>
}

export default WorkbenchRow
