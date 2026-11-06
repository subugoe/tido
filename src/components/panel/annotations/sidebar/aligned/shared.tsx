import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { getAnnotationType, getTextualBody } from '@/utils/annotation-data.ts'
import { AlignedEntry, getTextLetter, OffsetDirection } from '@/utils/aligned-layout.ts'
import { cn } from '@/lib/utils.ts'

// Parts the entries of the aligned column and the cards of the workbench share.

// Fixed class names, so Tailwind finds them. A fifth text starts over with the first colour - its
// letter still tells it apart.
const ORIGIN_DOT_CLASSES = ['bg-text-origin-1', 'bg-text-origin-2', 'bg-text-origin-3', 'bg-text-origin-4']

// The text of an annotation on one line: its textual body without markup.
export function getAnnotationLabel(annotation: Annotation): string {
  const html = getTextualBody(annotation)?.value
  if (!html) return ''
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim()
}

export function useTypeLabel() {
  const { annotations: annotationsConfig } = useConfig()
  return (annotation: Annotation) => {
    const type = getAnnotationType(annotation) ?? ''
    return annotationsConfig?.types?.[type]?.label ?? type
  }
}

// The texts the given entries come from, in panel order, with how many entries each one has.
export function countOrigins(entries: Pick<AlignedEntry, 'textIndex'>[]): { textIndex: number, count: number }[] {
  const counts = new Map<number, number>()
  entries.forEach((e) => counts.set(e.textIndex, (counts.get(e.textIndex) ?? 0) + 1))
  return [...counts.entries()].sort((a, b) => a[0] - b[0]).map(([textIndex, count]) => ({ textIndex, count }))
}

// A small dot in the colour of the text plus its letter. Decorative: the accessible name of the
// entry says the same in words.
// With a direction it also points to where the target of that text lies, when it stands off the
// entry on screen.
export const Origin: FC<{ textIndex: number, count?: number, direction?: OffsetDirection }> = ({ textIndex, count, direction }) => (
  <span className="flex shrink-0 items-center gap-1" data-origin={getTextLetter(textIndex)} data-offset={direction}>
    <span className={cn('size-1.5 rounded-full', ORIGIN_DOT_CLASSES[textIndex % ORIGIN_DOT_CLASSES.length])} />
    {getTextLetter(textIndex)}{count !== undefined && ` ${count}`}
    {direction && <span className="font-medium text-foreground">{direction === 'up' ? '↑' : '↓'}</span>}
  </span>
)

// The direction in words, for the accessible name of an entry or a group.
export function useOffsetLabel() {
  const { t } = useTranslation()
  return (direction: OffsetDirection | undefined) => direction ? t(direction === 'up' ? 'target_above' : 'target_below') : ''
}

