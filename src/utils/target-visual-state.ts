import {
  ANNOTATION_BASE_STYLE,
  ANNOTATION_HOVER_CLASSES,
  ANNOTATION_IDS_ATTRIBUTE,
  HIGHLIGHTING_STYLE,
  NESTED_TARGET_HOVER_CLASSES,
  SELECTED_ANNOTATION_ATTRIBUTE,
  SELECTED_ANNOTATION_CLASSES
} from '@/utils/constants.ts'
import { isParentHovered, partOfSelectedTargets } from '@/utils/text.ts'

// Styling used to be split over three effects - one per state that could change it - and because
// the element's class list was the only record of what a target looked like, each of them had to
// remove the styles of the other two before adding its own. That is why the same "is any annotation
// of this target visible" loop appeared in all three, and why a rule could hold in one of them and
// not in the next. Here the rules are in one place and a target's classes are simply what its state
// says they are.
interface TargetVisualState {
  // the ids of the annotations that are visible on this target - what data-annotation-ids holds
  annotationIds: string[]
  base: boolean
  highlight: boolean
  hover: boolean
  nested: boolean
  selected: boolean
}

interface TargetVisualContext {
  // the targets of the hovered annotations, the nested ones included
  hoveredTargets: Element[]
  // the targets of the selected annotation - a target inside one of them counts as selected too
  selectedTargets: Element[]
  disabledTargets: Set<Element>
}

// The classes this module owns. A target's class list is set to exactly the ones its state asks
// for, so whatever it carried from an earlier state goes first.
const MANAGED_CLASSES = [...new Set([
  ...ANNOTATION_BASE_STYLE,
  ...HIGHLIGHTING_STYLE,
  ...ANNOTATION_HOVER_CLASSES,
  ...NESTED_TARGET_HOVER_CLASSES,
  ...SELECTED_ANNOTATION_CLASSES
])]

function getVisibleAnnotations(entry: MergedAnnotationEntry) {
  return entry.annotations.filter((_, i) => entry.filtered[i])
}

// The targets whose visible annotations are all of a type in annotations.disableHighlighting. It is
// resolved for the whole text before any single target can be, because a target asks it about its
// parents as well as about itself.
function getDisabledTargets(entries: MergedAnnotationEntry[], disabledHighlightTypes: Set<string>): Set<Element> {
  const disabledTargets = new Set<Element>()

  entries.forEach((entry) => {
    const visible = getVisibleAnnotations(entry)
    const allDisabled = visible.length > 0 && visible.every((a) => disabledHighlightTypes.has(a.body.annotationType))

    if (allDisabled) disabledTargets.add(entry.target)
  })

  return disabledTargets
}

function getTargetVisualState(entry: MergedAnnotationEntry, context: TargetVisualContext): TargetVisualState {
  const { target, parents } = entry
  const annotationIds = getVisibleAnnotations(entry).map((a) => a.id)

  // a target none of whose annotations pass the filters carries nothing at all
  const isVisible = annotationIds.length > 0
  const isDisabled = context.disabledTargets.has(target)
  const isSelected = partOfSelectedTargets(target, context.selectedTargets)
  const isHovered = context.hoveredTargets.includes(target)

  // a hovered parent that may be highlighted gives this target the nested border; one that may not
  // leaves it reading as a plain highlight instead
  const hasParentHovered = isParentHovered(context.hoveredTargets, parents)
  const hasHighlightedParentHovered = isParentHovered(
    context.hoveredTargets,
    parents.filter((parent) => !context.disabledTargets.has(parent))
  )
  const readsAsHighlightedChild = hasParentHovered && !hasHighlightedParentHovered

  return {
    annotationIds,
    base: isVisible,
    hover: isVisible && isHovered && (isDisabled || !readsAsHighlightedChild),
    nested: isVisible && isHovered && !isDisabled && hasHighlightedParentHovered,
    highlight: isVisible && !isDisabled && (isHovered ? readsAsHighlightedChild : !isSelected),
    selected: isSelected
  }
}

function classesFor(state: TargetVisualState): string[] {
  const classes: string[] = []

  if (state.base) classes.push(...ANNOTATION_BASE_STYLE)
  if (state.highlight) classes.push(...HIGHLIGHTING_STYLE)
  if (state.hover) classes.push(...ANNOTATION_HOVER_CLASSES)
  if (state.nested) classes.push(...NESTED_TARGET_HOVER_CLASSES)
  if (state.selected) classes.push(...SELECTED_ANNOTATION_CLASSES)

  return [...new Set(classes)]
}

// The single writer. Until the targets render themselves this is what puts the derived state on the
// element; it touches only what this module owns, so the synopsis and cross reference styles on the
// same target are left alone.
function applyTargetVisualState(target: Element, state: TargetVisualState) {
  target.classList.remove(...MANAGED_CLASSES)

  const classes = classesFor(state)
  if (classes.length > 0) target.classList.add(...classes)

  if (state.annotationIds.length > 0) target.setAttribute(ANNOTATION_IDS_ATTRIBUTE, [...new Set(state.annotationIds)].join())
  else target.removeAttribute(ANNOTATION_IDS_ATTRIBUTE)

  if (state.selected) target.setAttribute(SELECTED_ANNOTATION_ATTRIBUTE, 'true')
  else target.removeAttribute(SELECTED_ANNOTATION_ATTRIBUTE)
}

export type { TargetVisualState, TargetVisualContext }
export { getDisabledTargets, getTargetVisualState, classesFor, applyTargetVisualState, MANAGED_CLASSES }
