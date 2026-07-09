import { FC, useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { useSynopsisStore, SyncTargets } from '@/store/SynopsisStore.tsx'

const EXPANDED_POSITION = 'absolute left-1/2 top-0 z-50 -translate-x-1/2 -translate-y-[calc(100%-6px)]'
const COLLAPSED_POSITION = 'absolute left-1/2 top-0 z-50 -translate-x-1/2 -translate-y-[calc(100%-4px)]'

const SyncTargetsNavigation: FC = () => {
  const { syncedTargets, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
  const setNavigatedTarget = useSynopsisStore(state => state.setNavigatedTarget)
  const navigatedTarget = useSynopsisStore(state => state.navigatedTarget)
  const activeSyncedTargets = useSynopsisStore(state => state.activeSyncedTargets)
  const scrolledSyncedTargets = useSynopsisStore(state => state.scrolledSyncedTargets)
  const [navigatedTargetIndex, setNavigatedTargetIndex] = useState(0)
  const [collapsed, setCollapsed] = useState(false)

  function findNavigatedTargetIndex({ originTarget, targets }: SyncTargets, syncedTargets: HTMLElement[]) {
    const originIndex = originTarget ? syncedTargets.findIndex((el) => el === originTarget) : -1
    if (originIndex !== -1) return originIndex

    return syncedTargets.findIndex((el) => targets.some((ref) => el.matches(ref.selector)))
  }

  // Move the counter to the target that was last navigated to. navigatedTarget is published by
  // whichever panel's arrows were used
  useEffect(() => {
    if (!navigatedTarget) return

    const newSyncedTargetIndex = syncedTargets.findIndex((el) => el === navigatedTarget)
    if (newSyncedTargetIndex === -1) return

    setNavigatedTargetIndex(newSyncedTargetIndex)
  }, [navigatedTarget, syncedTargets])

  // When a scroll aligns the panels, move the counter to the target this panel was aligned on.
  useEffect(() => {
    const matchIndex = findNavigatedTargetIndex(scrolledSyncedTargets, syncedTargets)
    if (matchIndex === -1) return

    setNavigatedTargetIndex(matchIndex)
  }, [scrolledSyncedTargets, syncedTargets])

  useEffect(() => {
    const matchIndex = findNavigatedTargetIndex(activeSyncedTargets, syncedTargets)
    if (matchIndex !== -1) {
      setNavigatedTargetIndex(matchIndex)
      return
    }

    // otherwise just keep the index within range when the set of targets shrinks, i.e when toggling off a panel view text
    const newNavigatedIndex = syncedTargets.length === 0 ? 0 : Math.min(navigatedTargetIndex, syncedTargets.length - 1)
    setNavigatedTargetIndex(newNavigatedIndex)
  }, [activeSyncedTargets, syncedTargets])



  const total = syncedTargets.length
  if (total === 0) return null

  const isFirst = navigatedTargetIndex === 0
  const isLast = navigatedTargetIndex === total - 1


  function goToTarget(index: number) {
    // clamp to the boundaries - the arrows are disabled at the ends, so no wrap-around
    const nextIndex = Math.max(0, Math.min(index, syncedTargets.length - 1))
    if (nextIndex === navigatedTargetIndex) return

    // publish the navigated-to target; the panel containing it scrolls to and highlights it, and the
    // navigatedTarget effect above moves this counter to its index
    setNavigatedTarget(syncedTargets[nextIndex])
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
          onClick={() => goToTarget(navigatedTargetIndex + 1)}
        >
          <ChevronDown />
        </Button>
        <Badge className="min-w-10 justify-center rounded-full border-transparent bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
          {navigatedTargetIndex + 1}/{total}
        </Badge>
        <Button
          size="icon"
          variant="ghost"
          disabled={isFirst}
          className="h-6 w-6 rounded-full bg-amber-400 text-amber-900 hover:bg-amber-500 disabled:bg-amber-100 disabled:text-amber-300 disabled:opacity-100"
          aria-label={t('previous_synoptic_target')}
          onClick={() => goToTarget(navigatedTargetIndex - 1)}
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
