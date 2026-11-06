import { FC, useId, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronRight, CornerDownRight } from 'lucide-react'
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
export const Note: FC<{ annotation: Annotation }> = ({ annotation }) => {
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
  expanded: boolean
  context: WorkbenchRowContext
  onToggle: () => void
  // With this the expanded row lists its sub-annotations, each one opening the column that shows
  // it. Without it the row leaves them to the next column.
  onOpenChild?: (child: Annotation) => void
  // the sub-annotation whose column is open
  openChildId?: string | null
}

// A sub-annotation listed under a note: opens - or closes - the column that shows it.
const SubAnnotationLink: FC<{ annotation: Annotation, open: boolean, onOpen: () => void }> = ({ annotation, open, onOpen }) => {
  const setHoveredAnnotations = useSetHoveredAnnotations()
  const getTypeLabel = useTypeLabel()
  const typeLabel = getTypeLabel(annotation)
  const label = useMemo(() => getAnnotationLabel(annotation), [annotation])

  return <li data-sub-annotation-link={annotation.id}>
    <button
      type="button"
      aria-expanded={open}
      aria-label={`${typeLabel}: ${label}`}
      onClick={onOpen}
      onMouseEnter={() => setHoveredAnnotations([annotation.id])}
      onMouseLeave={() => setHoveredAnnotations(null)}
      className={cn(
        'flex w-full min-h-8 items-center gap-2 rounded-md px-1.5 text-left text-sm cursor-pointer hover:bg-muted',
        'focus-visible:outline-2 focus-visible:outline-primary',
        open && 'bg-muted font-medium'
      )}
    >
      <CornerDownRight size={14} aria-hidden className="shrink-0 text-muted-foreground" />
      <span aria-hidden className="shrink-0 text-xs text-muted-foreground">{typeLabel}</span>
      <span aria-hidden className="min-w-0 flex-1 truncate">{label}</span>
    </button>
  </li>
}

// One annotation on the workbench or in a column: a header that expands its metadata and note.
const WorkbenchRow: FC<Props> = ({ annotation, expanded, context, onToggle, onOpenChild, openChildId }) => {
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

  return <li data-workbench-row={annotation.id}>
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

      {onOpenChild && children.length > 0 && <section>
        <h4 className="mb-1 text-xs font-medium text-muted-foreground">{t('sub_annotations_list', { count: children.length })}</h4>
        <ul className="flex flex-col gap-0.5">
          {children.map((child) => <SubAnnotationLink
            key={child.id}
            annotation={child}
            open={openChildId === child.id}
            onOpen={() => onOpenChild(child)}
          />)}
        </ul>
      </section>}
    </div>}
  </li>
}

export default WorkbenchRow
