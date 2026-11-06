import { FC, KeyboardEvent, RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { SubAnnotationColumnsModel, useSubAnnotationColumns } from '@/contexts/SubAnnotationColumnsContext.tsx'
import { getAnnotationTargets, getTextualBody } from '@/utils/annotation-data.ts'
import { getSelectorValue } from '@/utils/annotations.ts'
import { markProgrammaticScroll } from '@/utils/dom.ts'
import { COLUMN_WIDTH, findInNote, getColumnsWidth, getExcerpt, getFullColumnCount, MIN_TEXT_WIDTH, STRIP_WIDTH } from '@/utils/columns.ts'
import WorkbenchRow, { Note, WorkbenchRowContext } from '@/components/panel/annotations/sidebar/aligned/WorkbenchRow.tsx'
import { getAnnotationLabel, useTypeLabel } from '@/components/panel/annotations/sidebar/aligned/shared.tsx'

interface Props {
  // the row holding the texts and the columns - what the room for the columns is measured on
  rowRef: RefObject<HTMLElement>
}

// Sub-annotations carry no text index of their own, so the rows in a column show no origin.
const NO_ORIGIN = () => undefined as number | undefined

// The levels of a path that get a column: every annotation on it that has sub-annotations, by its
// index in the path.
function getLevels(model: SubAnnotationColumnsModel | null): number[] {
  if (!model) return []
  return model.path
    .map((id, index) => ({ id, index }))
    .filter(({ id }) => model.childrenOf(id).length > 0)
    .map(({ index }) => index)
}

// What keeps a text in place while the columns change its width: an element of it and where that
// stands on screen.
interface Anchor {
  container: HTMLElement
  el: Element
  top: number
}

function captureAnchors(row: HTMLElement | null, model: SubAnnotationColumnsModel | null): Anchor[] {
  if (!row) return []
  const root = model ? model.annotationsById.get(model.path[0]) : null
  const rootSelector = root ? getSelectorValue(getAnnotationTargets(root)[0]) : null

  return Array.from(row.querySelectorAll('[data-text-container]')).flatMap((node) => {
    const container = node as HTMLElement
    if (container.offsetWidth === 0) return []
    const containerTop = container.getBoundingClientRect().top

    // The annotation of the column in its own text, else the topmost target still on screen.
    let el: Element | null = null
    if (rootSelector && container.getAttribute('data-content-url') === model.rootContentUrl) {
      try {
        el = container.querySelector(`:scope ${rootSelector}`)
      } catch {
        el = null
      }
    }
    if (!el) {
      el = Array.from(container.querySelectorAll('[data-annotation-ids]'))
        .find((target) => target.getBoundingClientRect().bottom > containerTop) ?? null
    }
    return el ? [{ container, el, top: el.getBoundingClientRect().top }] : []
  })
}

// Where the sub-annotation chosen in a column sits in the note of the annotation it hangs off.
const FoundIn: FC<{ parent: Annotation, child: Annotation }> = ({ parent, child }) => {
  const { t } = useTranslation()
  const [full, setFull] = useState(false)

  const excerpt = useMemo(() => {
    const html = getTextualBody(parent)?.value
    const selector = getSelectorValue(getAnnotationTargets(child)[0])
    const found = html && selector ? findInNote(html, selector) : null
    return found ? getExcerpt(found.text, found.start, found.end) : null
  }, [parent, child])

  if (!excerpt) return null

  return <section data-column-found-in className="rounded-md bg-muted px-2 py-1.5 text-sm">
    <h4 className="mb-0.5 text-xs font-medium text-muted-foreground">{t('found_in')}</h4>
    {full
      ? <Note annotation={parent} />
      : <p>
        {excerpt.cutBefore && '… '}{excerpt.before}
        <mark className="rounded-sm bg-annotation-selected px-0.5 text-inherit">{excerpt.match}</mark>
        {excerpt.after}{excerpt.cutAfter && ' …'}
      </p>}
    <button
      type="button"
      aria-expanded={full}
      onClick={() => setFull(!full)}
      className="mt-1 text-xs font-medium text-primary hover:underline cursor-pointer"
    >
      {full ? t('show_short_note') : t('show_full_note')}
    </button>
  </section>
}

interface ColumnProps {
  model: SubAnnotationColumnsModel
  // index of the annotation in the path whose sub-annotations the column lists
  index: number
  level: number
  rowContext: WorkbenchRowContext
}

const Column: FC<ColumnProps> = ({ model, index, level, rowContext }) => {
  const { t } = useTranslation()
  const getTypeLabel = useTypeLabel()
  const { path, annotationsById, childrenOf, setPath, showInText } = model
  const parent = annotationsById.get(path[index])
  const chosenId = path[index + 1] ?? null
  const chosen = chosenId ? annotationsById.get(chosenId) : null
  const label = (id: string) => {
    const annotation = annotationsById.get(id)
    return annotation ? `${getTypeLabel(annotation)}: ${getAnnotationLabel(annotation)}` : id
  }

  return <section
    data-sub-annotation-column={level}
    aria-label={`${t('level', { level })}: ${label(path[index])}`}
    className="flex h-full shrink-0 flex-col border-l border-border bg-background"
    style={{ width: COLUMN_WIDTH }}
  >
    <div className="flex items-center gap-1 border-b border-border px-3 py-1.5">
      <h3 className="text-xs font-medium text-muted-foreground">{t('level', { level })}</h3>
      <Button
        size="iconSm"
        variant="ghost"
        className="ml-auto"
        aria-label={t('close_column')}
        data-column-close
        // closing a column takes the annotation it lists off the path - and everything below it
        onClick={() => setPath(index > 0 ? path.slice(0, index) : null)}
      >
        <X />
      </Button>
    </div>

    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3">
      <nav aria-label={t('path')}>
        <ol className="flex flex-col gap-0.5 text-xs">
          <li className="flex items-center gap-2">
            <span className="min-w-0 flex-1 truncate">{label(path[0])}</span>
            <button type="button" data-column-show-in-text onClick={showInText} className="shrink-0 font-medium text-primary hover:underline cursor-pointer">
              {t('show_in_text')}
            </button>
          </li>
          {path.slice(1, index + 1).map((id, i) => <li key={id} style={{ paddingLeft: (i + 1) * 8 }}>
            {i + 1 === index
              ? <span aria-current="location" className="block truncate font-medium">↳ {label(id)}</span>
              : <button type="button" onClick={() => setPath(path.slice(0, i + 2))} className="block w-full truncate text-left hover:underline cursor-pointer">↳ {label(id)}</button>}
          </li>)}
        </ol>
      </nav>

      {parent && chosen && <FoundIn parent={parent} child={chosen} />}

      <ul className="flex flex-col gap-0.5">
        {childrenOf(path[index]).map((child) => {
          const expanded = chosenId === child.id
          return <WorkbenchRow
            key={child.id}
            annotation={child}
            expanded={expanded}
            context={rowContext}
            onToggle={() => setPath(expanded ? path.slice(0, index + 1) : [...path.slice(0, index + 1), child.id])}
          />
        })}
      </ul>
    </div>
  </section>
}

// An older level, folded to a strip: its number and its title upright. A click goes back to it.
const Strip: FC<{ model: SubAnnotationColumnsModel, index: number, level: number }> = ({ model, index, level }) => {
  const { t } = useTranslation()
  const annotation = model.annotationsById.get(model.path[index])
  const title = annotation ? getAnnotationLabel(annotation) : ''

  return <button
    type="button"
    data-sub-annotation-strip={level}
    aria-label={t('back_to_level', { level, label: title })}
    onClick={() => model.setPath(model.path.slice(0, index + 1))}
    className="flex h-full shrink-0 cursor-pointer flex-col items-center gap-2 border-l border-border bg-muted py-2 text-xs hover:bg-background focus-visible:outline-2 focus-visible:outline-primary"
    style={{ width: STRIP_WIDTH }}
  >
    <span aria-hidden className="font-medium">{level}</span>
    <span aria-hidden className="min-h-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap [writing-mode:vertical-rl] rotate-180 text-muted-foreground">{title}</span>
  </button>
}

// The columns of the sub-annotations opened on the workbench, between the texts and the sidebar.
// Level 1 stands next to the sidebar, deeper levels further left. They take their room from the
// texts, which keep their place on screen while that happens.
const SubAnnotationColumns: FC<Props> = ({ rowRef }) => {
  const { t } = useTranslation()
  const { model } = useSubAnnotationColumns()
  const [room, setRoom] = useState({ width: 0, texts: 0 })

  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    const measure = () => {
      const texts = Array.from(row.querySelectorAll('[data-text-container]')).filter((el) => (el as HTMLElement).offsetWidth > 0).length
      setRoom((prev) => prev.width === row.clientWidth && prev.texts === texts ? prev : { width: row.clientWidth, texts })
    }
    const observer = new ResizeObserver(measure)
    observer.observe(row)
    measure()
    return () => observer.disconnect()
  }, [rowRef])

  const levels = getLevels(model)
  // the row holds the texts and the columns, so its width does not change when they do
  const currentWidth = useRef(0)
  const available = room.width - Math.max(1, room.texts) * MIN_TEXT_WIDTH
  const fullCount = getFullColumnCount(levels.length, available)
  const width = getColumnsWidth(levels.length, fullCount)

  // A change of width moves the text under the reader's eyes - so before it lands, every text notes
  // an element and where it stands, and is scrolled back to that afterwards.
  const lastModel = useRef(model)
  const anchors = useRef<Anchor[] | null>(null)
  if (width !== currentWidth.current && anchors.current === null) {
    anchors.current = captureAnchors(rowRef.current, model ?? lastModel.current)
  }
  lastModel.current = model ?? lastModel.current

  useLayoutEffect(() => {
    currentWidth.current = width
    const pending = anchors.current
    anchors.current = null
    if (!pending || pending.length === 0) return

    const restore = () => pending.forEach(({ container, el, top }) => {
      const delta = el.getBoundingClientRect().top - top
      if (Math.abs(delta) < 1) return
      markProgrammaticScroll(container)
      container.scrollTop += delta
    })

    // The texts take their new width only once the pane layout has followed the row - a frame or
    // two later - and their content re-wraps after that. Each of these steps is caught here, for as
    // long as the change takes.
    const observer = new ResizeObserver(restore)
    pending.forEach(({ container }) => {
      observer.observe(container)
      Array.from(container.children).forEach((child) => observer.observe(child))
    })
    restore()
    const timeout = window.setTimeout(() => observer.disconnect(), 500)

    return () => {
      window.clearTimeout(timeout)
      observer.disconnect()
    }
  }, [width])

  const rowContext = useMemo<WorkbenchRowContext>(() => ({
    childrenOf: model?.childrenOf ?? (() => []),
    showOrigin: false,
    textIndexOf: NO_ORIGIN
  }), [model])

  if (!model || levels.length === 0) return null

  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Escape') return
    e.stopPropagation()
    model.escape()
  }

  // deepest level on the left; the shallow ones beyond the full columns are folded to strips
  const stripCount = levels.length - fullCount
  const ordered = levels.map((index, i) => ({ index, level: i + 1 })).reverse()

  return <div
    data-sub-annotation-columns
    role="region"
    aria-label={t('sub_annotation_columns')}
    onKeyDown={onKeyDown}
    className="flex h-full shrink-0"
    style={{ width }}
  >
    {ordered.map(({ index, level }) => level <= stripCount
      ? <Strip key={index} model={model} index={index} level={level} />
      : <Column key={index} model={model} index={index} level={level} rowContext={rowContext} />)}
  </div>
}

export default SubAnnotationColumns
