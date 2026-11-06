import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useIsAnnotationHovered, useIsAnyAnnotationHovered, useSetHoveredAnnotations } from '@/contexts/TextContext.tsx'
import { ALIGNED_ITEM_HEIGHT, AlignedEntry, AlignedSlot, getEntryKey, getTextLetter } from '@/utils/aligned-layout.ts'
import { cn } from '@/lib/utils.ts'
import { countOrigins, getAnnotationLabel, Origin, useTypeLabel } from '@/components/panel/annotations/sidebar/aligned/shared.tsx'

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
  onSelect: (entry: AlignedEntry, trigger: HTMLElement) => void
  onOpenGroup: (members: AlignedEntry[], trigger: HTMLElement) => void
}

interface EntryButtonProps {
  entry: AlignedEntry
  column: AlignedColumnInfo
  onSelect: (entry: AlignedEntry, trigger: HTMLElement) => void
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
      onSelect(entry, e.currentTarget)
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
// pushed away from their targets. A group opens as one card on the workbench.
const AlignedSlotView: FC<Props> = ({ slot, column, onSelect, onOpenGroup }) => {
  const { t } = useTranslation()
  const { selectedAnnotation } = usePanel()
  const setHoveredAnnotations = useSetHoveredAnnotations()

  const memberIds = useMemo(() => slot.members.map((m) => m.annotation.id), [slot])
  const origins = useMemo(() => countOrigins(slot.members), [slot])
  const isGroup = slot.members.length > 1
  const containsSelected = !!selectedAnnotation && memberIds.includes(selectedAnnotation.annotation?.id)
  const containsHovered = useIsAnyAnnotationHovered(memberIds)

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

  return <div className="absolute inset-x-0" style={{ top: slot.y }} data-annotation-group={slot.id}>
    <button
      type="button"
      aria-haspopup="dialog"
      aria-label={groupName}
      onClick={(e) => {
        e.stopPropagation()
        onOpenGroup(slot.members, e.currentTarget)
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
    </button>
    {/* The members as entries of their own, never shown: the group stands for them in the column,
        but each annotation keeps an element carrying its id and selection state. */}
    <ul hidden className="hidden">
      {slot.members.map((entry) => <li key={getEntryKey(entry)}>
        <EntryButton entry={entry} column={column} onSelect={onSelect} />
      </li>)}
    </ul>
  </div>
}

export default AlignedSlotView
