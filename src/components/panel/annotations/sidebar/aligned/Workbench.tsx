import { FC, KeyboardEvent, useEffect, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { cn } from '@/lib/utils.ts'
import { WorkbenchCard, WorkbenchState } from '@/utils/workbench.ts'
import WorkbenchRow, { WorkbenchRowContext } from '@/components/panel/annotations/sidebar/aligned/WorkbenchRow.tsx'
import { countOrigins, getAnnotationLabel, Origin, useTypeLabel } from '@/components/panel/annotations/sidebar/aligned/shared.tsx'

export interface WorkbenchActions {
  activate: (key: string) => void
  close: (key: string) => void
  closeAll: () => void
  collapseAll: () => void
  toggleCollapsed: (key: string) => void
  // a row of the column's annotations was clicked
  toggleRow: (key: string, annotationId: string) => void
  // a sub-annotation row was clicked: path is what is open below the row afterwards
  setSubPath: (key: string, rowId: string, path: string[] | null) => void
  escape: () => void
}

interface Props {
  state: WorkbenchState
  annotationsById: Map<string, Annotation>
  context: WorkbenchRowContext
  actions: WorkbenchActions
  // the card whose header should take the focus, with a counter so the same card can ask again
  focusRequest: { key: string, n: number } | null
}

interface CardProps {
  card: WorkbenchCard
  active: boolean
  annotationsById: Map<string, Annotation>
  context: WorkbenchRowContext
  actions: WorkbenchActions
}

const Card: FC<CardProps> = ({ card, active, annotationsById, context, actions }) => {
  const { t } = useTranslation()
  const getTypeLabel = useTypeLabel()
  const bodyId = useId()

  const annotations = card.annotationIds.map((id) => annotationsById.get(id)).filter(Boolean)
  const isGroup = annotations.length > 1
  const first = annotations[0]

  const origins = countOrigins(card.annotationIds
    .map((id) => context.textIndexOf(id))
    .filter((textIndex): textIndex is number => textIndex !== undefined)
    .map((textIndex) => ({ textIndex })))

  const title = isGroup
    ? `${annotations.length} ${t('annotations')}`
    : `${getTypeLabel(first)}: ${getAnnotationLabel(first)}`

  return <li
    data-workbench-card={card.key}
    data-active={active || undefined}
    onClickCapture={() => { if (!active) actions.activate(card.key) }}
    className={cn('rounded-lg border bg-background shadow-sm', active ? 'border-primary ring-1 ring-primary' : 'border-border')}
  >
    <div className="flex items-center gap-1 pr-1">
      <button
        type="button"
        data-workbench-card-header
        aria-expanded={!card.collapsed}
        aria-controls={bodyId}
        onClick={() => actions.toggleCollapsed(card.key)}
        className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-lg px-3 text-left text-sm font-medium cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
      >
        {isGroup && <span aria-hidden className="shrink-0 rounded-full bg-muted px-1.5 text-xs">{annotations.length}</span>}
        <span className="min-w-0 flex-1 truncate">{isGroup ? t('annotations') : title}</span>
        {context.showOrigin && <span aria-hidden className="flex shrink-0 items-center gap-1 text-xs font-normal text-muted-foreground">
          {origins.map((o, i) => <span key={o.textIndex} className="flex items-center gap-1">
            {i > 0 && <span>·</span>}
            <Origin textIndex={o.textIndex} count={isGroup ? o.count : undefined} />
          </span>)}
        </span>}
      </button>
      <Button size="iconSm" variant="ghost" aria-label={t('close_card')} onClick={() => actions.close(card.key)} data-workbench-close>
        <X />
      </Button>
    </div>

    {!card.collapsed && <ul id={bodyId} className="max-h-[300px] overflow-y-auto border-t border-border px-1.5 py-1 flex flex-col gap-0.5">
      {annotations.map((annotation) => <WorkbenchRow
        key={annotation.id}
        annotation={annotation}
        expanded={card.expandedRows.includes(annotation.id)}
        context={context}
        onToggle={() => actions.toggleRow(card.key, annotation.id)}
        openChildId={card.subPaths[annotation.id]?.[0] ?? null}
        onOpenChild={(child) => {
          const open = card.subPaths[annotation.id]?.[0] === child.id
          actions.setSubPath(card.key, annotation.id, open ? null : [child.id])
        }}
      />)}
    </ul>}
  </li>
}

// The workbench: an overlay over the sidebar's list holding the opened cards, newest on top. It
// never covers the text. While it is open the list behind it stands still.
const Workbench: FC<Props> = ({ state, annotationsById, context, actions, focusRequest }) => {
  const { t } = useTranslation()
  const rootRef = useRef<HTMLDivElement>(null)
  const headingId = useId()

  useEffect(() => {
    if (!focusRequest) return
    const header = rootRef.current?.querySelector(`[data-workbench-card="${CSS.escape(focusRequest.key)}"] [data-workbench-card-header]`) as HTMLElement | null
    header?.focus()
  }, [focusRequest])

  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Escape') return
    e.stopPropagation()
    actions.escape()
  }

  if (state.cards.length === 0) return null

  return <div
    ref={rootRef}
    data-workbench
    role="region"
    aria-labelledby={headingId}
    onKeyDown={onKeyDown}
    className="pointer-events-auto absolute inset-0 z-30 flex flex-col bg-workbench backdrop-blur-[2px]"
  >
    <div className="flex items-center gap-1 px-3 py-1.5">
      <h3 id={headingId} className="text-sm font-medium">{t('workbench')}</h3>
      <Button size="xs" variant="ghost" className="ml-auto" onClick={actions.collapseAll} data-workbench-collapse-all>{t('collapse_all')}</Button>
      <Button size="xs" variant="ghost" onClick={actions.closeAll} data-workbench-close-all>{t('close_all')}</Button>
    </div>
    <ol className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 pb-3">
      {state.cards.map((card) => <Card
        key={card.key}
        card={card}
        active={card.key === state.activeKey}
        annotationsById={annotationsById}
        context={context}
        actions={actions}
      />)}
    </ol>
  </div>
}

export default Workbench
