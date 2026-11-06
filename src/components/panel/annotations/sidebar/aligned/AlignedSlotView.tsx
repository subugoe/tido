import { FC, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useIsAnnotationHovered, useIsAnyAnnotationHovered, useSetHoveredAnnotations } from '@/contexts/TextContext.tsx'
import { getAnnotationType, getTextualBody } from '@/utils/annotation-data.ts'
import { ALIGNED_ITEM_HEIGHT, AlignedEntry, AlignedSlot, getEntryKey, getTextLetter } from '@/utils/aligned-layout.ts'
import { cn } from '@/lib/utils.ts'

// What every slot needs to know about the column it stands in.
export interface AlignedColumnInfo {
  // the number of sub-annotations per annotation id
  subAnnotationCounts: Map<string, number>
  // whether the panel shows more than one text, so the entries say which one they belong to
  showOrigin: boolean
}

interface Props {
  slot: AlignedSlot
  column: AlignedColumnInfo
  onSelect: (entry: AlignedEntry) => void
}

// Fixed class names, so Tailwind finds them. A fifth text starts over with the first colour - its
// letter still tells it apart.
const ORIGIN_DOT_CLASSES = ['bg-text-origin-1', 'bg-text-origin-2', 'bg-text-origin-3', 'bg-text-origin-4']

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

// The texts the given entries come from, in panel order, with how many entries each one has.
function countOrigins(entries: AlignedEntry[]): { textIndex: number, count: number }[] {
  const counts = new Map<number, number>()
  entries.forEach((e) => counts.set(e.textIndex, (counts.get(e.textIndex) ?? 0) + 1))
  return [...counts.entries()].sort((a, b) => a[0] - b[0]).map(([textIndex, count]) => ({ textIndex, count }))
}

// A small dot in the colour of the text plus its letter. Decorative: the accessible name of the
// entry says the same in words.
const Origin: FC<{ textIndex: number, count?: number }> = ({ textIndex, count }) => (
  <span className="flex shrink-0 items-center gap-1">
    <span className={cn('size-1.5 rounded-full', ORIGIN_DOT_CLASSES[textIndex % ORIGIN_DOT_CLASSES.length])} />
    {getTextLetter(textIndex)}{count !== undefined && ` ${count}`}
  </span>
)

interface EntryButtonProps {
  entry: AlignedEntry
  column: AlignedColumnInfo
  onSelect: (entry: AlignedEntry) => void
}

const EntryButton: FC<EntryButtonProps> = ({ entry, column, onSelect }) => {
  const { t } = useTranslation()
  const { selectedAnnotation } = usePanel()
  const setHoveredAnnotations = useSetHoveredAnnotations()
  const getTypeLabel = useTypeLabel()

  const { annotation, textIndex } = entry
  const isSelected = selectedAnnotation?.annotation?.id === annotation.id
  const isHovered = useIsAnnotationHovered(annotation.id)
  const typeLabel = getTypeLabel(annotation)
  const label = useMemo(() => getAnnotationLabel(annotation), [annotation])
  const subCount = column.subAnnotationCounts.get(annotation.id) ?? 0

  const accessibleName = [
    `${typeLabel}: ${label}`,
    subCount > 0 && t('sub_annotations_count', { count: subCount }),
    column.showOrigin && t('text_origin', { letter: getTextLetter(textIndex) })
  ].filter(Boolean).join(', ')

  return <button
    type="button"
    data-annotation={annotation.id}
    {...(isSelected ? { 'data-selected': true } : {})}
    aria-pressed={isSelected}
    aria-label={accessibleName}
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
      isHovered && !isSelected && 'border-primary'
    )}
    style={{ height: ALIGNED_ITEM_HEIGHT }}
  >
    <span aria-hidden className="shrink-0 text-xs text-muted-foreground">{typeLabel}</span>
    <span aria-hidden className="min-w-0 flex-1 truncate">{label}</span>
    <span aria-hidden className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
      {subCount > 0 && <span>↳ {subCount}</span>}
      {column.showOrigin && <Origin textIndex={textIndex} />}
    </span>
  </button>
}

// One slot of the aligned column: a single entry, or a group of the entries that would have been
// pushed away from their targets. A group lists its members on demand.
const AlignedSlotView: FC<Props> = ({ slot, column, onSelect }) => {
  const { t } = useTranslation()
  const { selectedAnnotation } = usePanel()
  const setHoveredAnnotations = useSetHoveredAnnotations()
  const [expanded, setExpanded] = useState(false)
  const groupButtonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const memberIds = useMemo(() => slot.members.map((m) => m.annotation.id), [slot])
  const origins = useMemo(() => countOrigins(slot.members), [slot])
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
      <EntryButton entry={slot.members[0]} column={column} onSelect={onSelect} />
    </div>
  }

  const groupName = column.showOrigin
    ? t('annotations_from_texts', {
      count: slot.members.length,
      origins: origins.map((o) => `${t('text_origin', { letter: getTextLetter(o.textIndex) })}: ${o.count}`).join(', ')
    })
    : `${slot.members.length} ${t('annotations')}`

  return <div className={cn('absolute inset-x-0', expanded && 'z-20')} style={{ top: slot.y }} data-annotation-group={slot.id}>
    <button
      ref={groupButtonRef}
      type="button"
      aria-expanded={expanded}
      aria-label={groupName}
      onClick={(e) => {
        e.stopPropagation()
        setExpanded(!expanded)
      }}
      onMouseEnter={() => setHoveredAnnotations(memberIds)}
      onMouseLeave={() => setHoveredAnnotations(null)}
      className={cn(
        'flex w-full items-center gap-2 rounded-md border px-2 text-left text-sm cursor-pointer bg-background/70 hover:bg-background',
        // a second card peeking out below: the group stands for several entries
        'shadow-[0_3px_0_-1px_var(--color-background),0_3px_0_0_var(--color-border)]',
        'focus-visible:outline-2 focus-visible:outline-primary',
        containsSelected || containsHovered ? 'border-primary' : 'border-border'
      )}
      style={{ height: ALIGNED_ITEM_HEIGHT }}
    >
      <span aria-hidden className="shrink-0 rounded-full bg-muted px-1.5 text-xs font-medium">{slot.members.length}</span>
      <span aria-hidden className="min-w-0 flex-1 truncate">{t('annotations')}</span>
      {column.showOrigin && <span aria-hidden className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
        {origins.map((o, i) => <span key={o.textIndex} className="flex items-center gap-1">
          {i > 0 && <span>·</span>}
          <Origin textIndex={o.textIndex} count={o.count} />
        </span>)}
      </span>}
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
        <EntryButton entry={entry} column={column} onSelect={(e) => {
          onSelect(e)
          collapse(false)
        }} />
      </li>)}
    </ul>
  </div>
}

export default AlignedSlotView
