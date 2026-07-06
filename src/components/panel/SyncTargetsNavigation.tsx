import { FC, useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { getSyncedTargets } from '@/utils/annotations.ts'
import { useSynopsisStore } from '@/store/SynopsisStore.tsx'

// Position the control in the gutter just above the panel card. The panel root (PanelShell) is
// `relative` and not clipped, so a fully-upward translate floats the control above the card without
// overlapping the panel header/title. A few pixels of overlap keep it visually attached to the card.
const EXPANDED_POSITION = 'absolute left-1/2 top-0 z-50 -translate-x-1/2 -translate-y-[calc(100%-6px)]'
const COLLAPSED_POSITION = 'absolute left-1/2 top-0 z-50 -translate-x-1/2 -translate-y-[calc(100%-4px)]'

// Floating control at the top of a panel that lets the user step through the panel's synoptic
// targets. Each step activates a target's synopsis (highlighting its synced targets in the other
// panels and bringing the origin target into view - see GenericTextRenderer's activeSyncedTargets
// effect).
const SyncTargetsNavigation: FC = () => {
  const { syncedTargets, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
  const setActiveSyncedTargets = useSynopsisStore((state) => state.setActiveSyncedTargets)

  // local copy of the panel's sync targets in the same shape as GenericTextRenderer's targetsSyncMap
  const [syncedTargetsMap, setSyncedTargetsMap] = useState<Map<HTMLElement, Annotation[]>>(new Map())
  const [activeTargetIndex, setActiveTargetIndex] = useState(0)
  const [collapsed, setCollapsed] = useState(false)

  // Rebuild the local map whenever the panel's collected sync targets change.
  useEffect(() => {
    const map = new Map<HTMLElement, Annotation[]>()
    syncedTargets.forEach(({ target, annotations }) => map.set(target, annotations))
    setSyncedTargetsMap(map)
    // keep the active index within range when the set of targets shrinks

    setActiveTargetIndex((prev) => (map.size === 0 ? 0 : Math.min(prev, map.size - 1)))
  }, [syncedTargets])

  const total = syncedTargetsMap.size
  if (total === 0) return null

  const isFirst = activeTargetIndex === 0
  const isLast = activeTargetIndex === total - 1

  function goToTarget(index: number) {
    const entries = Array.from(syncedTargetsMap.entries())
    if (entries.length === 0) return

    // clamp to the boundaries - the arrows are disabled at the ends, so no wrap-around
    const nextIndex = Math.max(0, Math.min(index, entries.length - 1))
    if (nextIndex === activeTargetIndex) return
    setActiveTargetIndex(nextIndex)

    const [target, annotations] = entries[nextIndex]
    // the source the target lives in, so its synced targets resolve against the right content url
    const source = syncedTargets.find((e) => e.target === target)?.source
    if (!source) return

    const scrollContainer = target.closest('[data-text-container]') as HTMLElement | null
    const yPos = scrollContainer
      ? target.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top
      : 0

    const targets = getSyncedTargets(target, source, annotations)
    setActiveSyncedTargets({ yPos, originTarget: target, targets })
  }

  if (collapsed) {
    // collapsed UI: a small amber tab poking above the card that re-opens the control
    return (
      <div className={COLLAPSED_POSITION}>
        <button
          type="button"
          aria-label={t('synoptic_target')}
          onClick={() => setCollapsed(false)}
          className="flex h-5 w-11 items-center justify-center rounded-t-md bg-amber-400 text-amber-900 shadow-sm hover:bg-amber-500"
        >
          <ChevronDown className="size-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div className={EXPANDED_POSITION}>
      <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 shadow-md">
        <span className="whitespace-nowrap text-sm font-medium">{t('synoptic_target')}</span>
        <span className="h-5 w-px bg-border" />
        <Button
          size="icon"
          variant="ghost"
          disabled={isLast}
          className="h-6 w-6 rounded-full bg-amber-400 text-amber-900 hover:bg-amber-500 disabled:bg-amber-100 disabled:text-amber-300 disabled:opacity-100"
          aria-label={t('next_synoptic_target')}
          onClick={() => goToTarget(activeTargetIndex + 1)}
        >
          <ChevronDown />
        </Button>
        <Badge className="min-w-10 justify-center rounded-full border-transparent bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
          {activeTargetIndex + 1}/{total}
        </Badge>
        <Button
          size="icon"
          variant="ghost"
          disabled={isFirst}
          className="h-6 w-6 rounded-full bg-amber-400 text-amber-900 hover:bg-amber-500 disabled:bg-amber-100 disabled:text-amber-300 disabled:opacity-100"
          aria-label={t('previous_synoptic_target')}
          onClick={() => goToTarget(activeTargetIndex - 1)}
        >
          <ChevronUp />
        </Button>
        <span className="h-5 w-px bg-border" />
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 rounded-full text-muted-foreground"
          aria-label={t('collapse')}
          onClick={() => setCollapsed(true)}
        >
          <X />
        </Button>
      </div>
    </div>
  )
}

export default SyncTargetsNavigation
