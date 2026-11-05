import { FC, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useIsAnnotationHovered, useIsAnyAnnotationHovered, useSetHoveredAnnotations } from '@/contexts/TextContext.tsx'
import { getAnnotationType, getTextualBody } from '@/utils/annotation-data.ts'
import { ALIGNED_ITEM_HEIGHT, AlignedEntry, AlignedSlot, getEntryKey } from '@/utils/aligned-layout.ts'
import { cn } from '@/lib/utils.ts'

interface Props {
  slot: AlignedSlot
  onSelect: (entry: AlignedEntry) => void
}

// The text of an annotation on one line: its textual body without markup.
function getAnnotationLabel(annotation: Annotation): string {
  const html = getTextualBody(annotation)?.value
  if (!html) return ''
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim()
}

function useTypeLabel() {
  const { annotations: annotationsConfig } = useConfig()
  return (annotation: Annotation) => {
    const type = getAnnotationType(annotation) ?? ''
    return annotationsConfig?.types?.[type]?.label ?? type
  }
}

interface EntryButtonProps {
  entry: AlignedEntry
  onSelect: (entry: AlignedEntry) => void
  className?: string
}

const EntryButton: FC<EntryButtonProps> = ({ entry, onSelect, className }) => {
  const { selectedAnnotation } = usePanel()
  const setHoveredAnnotations = useSetHoveredAnnotations()
  const getTypeLabel = useTypeLabel()

  const { annotation } = entry
  const isSelected = selectedAnnotation?.annotation?.id === annotation.id
  const isHovered = useIsAnnotationHovered(annotation.id)
  const typeLabel = getTypeLabel(annotation)
  const label = useMemo(() => getAnnotationLabel(annotation), [annotation])

  return <button
    type="button"
    data-annotation={annotation.id}
    {...(isSelected ? { 'data-selected': true } : {})}
    aria-pressed={isSelected}
    aria-label={`${typeLabel}: ${label}`}
    title={label}
    onClick={(e) => {
      e.stopPropagation()
      onSelect(entry)
    }}
    onMouseEnter={() => setHoveredAnnotations([annotation.id])}
    onMouseLeave={() => setHoveredAnnotations(null)}
    onFocus={() => setHoveredAnnotations([annotation.id])}
    onBlur={() => setHoveredAnnotations(null)}
    className={cn(
      'flex w-full items-center gap-2 rounded-md border px-2 text-left text-sm cursor-pointer',
      'focus-visible:outline-2 focus-visible:outline-primary',
      isSelected ? 'bg-background border-primary outline-2 outline-primary shadow-sm' : 'bg-background/70 border-border hover:bg-background',
      isHovered && !isSelected && 'border-primary',
      className
    )}
    style={{ height: ALIGNED_ITEM_HEIGHT }}
  >
    <span className="shrink-0 text-xs text-muted-foreground">{typeLabel}</span>
    <span className="min-w-0 flex-1 truncate">{label}</span>
  </button>
}

// One slot of the aligned column: a single entry, or a group of the entries that would have been
// pushed away from their targets. A group lists its members on demand.
const AlignedSlotView: FC<Props> = ({ slot, onSelect }) => {
  const { t } = useTranslation()
  const { selectedAnnotation } = usePanel()
  const setHoveredAnnotations = useSetHoveredAnnotations()
  const [expanded, setExpanded] = useState(false)
  const groupButtonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const memberIds = useMemo(() => slot.members.map((m) => m.annotation.id), [slot])
  const isGroup = slot.members.length > 1
  const containsSelected = !!selectedAnnotation && memberIds.includes(selectedAnnotation.annotation?.id)
  const containsHovered = useIsAnyAnnotationHovered(memberIds)

  useEffect(() => {
    if (expanded) listRef.current?.querySelector('button')?.focus()
  }, [expanded])

  function collapse(focusGroup = true) {
    setExpanded(false)
    if (focusGroup) groupButtonRef.current?.focus()
  }

  function onListKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation()
      collapse()
    }
  }

  if (!isGroup) {
    return <div className="absolute inset-x-0" style={{ top: slot.y }}>
      <EntryButton entry={slot.members[0]} onSelect={onSelect} />
    </div>
  }

  return <div className={cn('absolute inset-x-0', expanded && 'z-20')} style={{ top: slot.y }} data-annotation-group={slot.id}>
    <button
      ref={groupButtonRef}
      type="button"
      aria-expanded={expanded}
      aria-label={`${slot.members.length} ${t('annotations')}`}
      onClick={(e) => {
        e.stopPropagation()
        setExpanded(!expanded)
      }}
      onMouseEnter={() => setHoveredAnnotations(memberIds)}
      onMouseLeave={() => setHoveredAnnotations(null)}
      className={cn(
        'flex w-full items-center gap-2 rounded-md border px-2 text-left text-sm cursor-pointer bg-background/70 hover:bg-background',
        'focus-visible:outline-2 focus-visible:outline-primary',
        containsSelected ? 'border-primary' : 'border-border',
        containsHovered && 'border-primary'
      )}
      style={{ height: ALIGNED_ITEM_HEIGHT }}
    >
      <span className="shrink-0 rounded-full bg-muted px-1.5 text-xs font-medium">{slot.members.length}</span>
      <span className="min-w-0 flex-1 truncate">{t('annotations')}</span>
      {expanded ? <ChevronUp size={16} aria-hidden /> : <ChevronDown size={16} aria-hidden />}
    </button>
    {/* rendered while collapsed too, only hidden - the members stay part of the sidebar's DOM */}
    <ul
      ref={listRef}
      hidden={!expanded}
      onKeyDown={onListKeyDown}
      className={cn('mt-1 flex-col gap-1 rounded-md border border-border bg-background p-1 shadow-md', expanded ? 'flex' : 'hidden')}
    >
      {slot.members.map((entry) => <li key={getEntryKey(entry)}>
        <EntryButton entry={entry} onSelect={(e) => {
          onSelect(e)
          collapse(false)
        }} />
      </li>)}
    </ul>
  </div>
}

export default AlignedSlotView
