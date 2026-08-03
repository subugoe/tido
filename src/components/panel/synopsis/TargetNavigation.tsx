import { FC, useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, EyeOff } from 'lucide-react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import NavigationButton from '@/components/panel/synopsis/NavigationButton.tsx'
import NavigationCollapsed from '@/components/panel/synopsis/NavigationCollapsed.tsx'
import { useSynopsisStore, SyncTargets } from '@/store/SynopsisStore.tsx'

const EXPANDED_POSITION = 'absolute left-1/2 top-0 z-50 -translate-x-1/2 -translate-y-[calc(100%-6px)]'

const SyncTargetNavigation: FC = () => {
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
    if (!scrolledSyncedTargets) return
    const matchIndex = findNavigatedTargetIndex(scrolledSyncedTargets, syncedTargets)
    if (matchIndex === -1) return

    setNavigatedTargetIndex(matchIndex)
  }, [scrolledSyncedTargets, syncedTargets])

  useEffect(() => {
    if (!activeSyncedTargets) return
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


  function goToTarget(index: number, syncedTargets: HTMLElement[]) {
    // clamp to the boundaries - the arrows are disabled at the ends, so no wrap-around
    const nextIndex = Math.max(0, Math.min(index, syncedTargets.length - 1))
    if (nextIndex === navigatedTargetIndex) return

    setNavigatedTarget(syncedTargets[nextIndex])
  }


  if (collapsed) return <NavigationCollapsed onOpen={() => setCollapsed(false)} />

  return (
    <div className={EXPANDED_POSITION} data-cy="sync-target-navigation">
      <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 shadow-md">
        <span className="whitespace-nowrap text-sm font-medium">{t('synoptic_target')}</span>
        <span className="h-5 w-px bg-border" />
        <NavigationButton
          isDisabled={isLast}
          ariaLabel={t('next_synoptic_target')}
          onSelect={() => goToTarget(navigatedTargetIndex + 1, syncedTargets)}
        >
          <ChevronDown />
        </NavigationButton>
        <Badge
          className="min-w-10 justify-center rounded-full border-transparent bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900"
          data-cy="sync-target-counter"
        >
          {navigatedTargetIndex + 1}/{total}
        </Badge>
        <NavigationButton
          isDisabled={isFirst}
          ariaLabel={t('previous_synoptic_target')}
          onSelect={() => goToTarget(navigatedTargetIndex - 1, syncedTargets)}
        >
          <ChevronUp />
        </NavigationButton>
        <span className="h-5 w-px bg-border" />
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 rounded-full text-muted-foreground"
          aria-label={t('collapse')}
          onClick={() => setCollapsed(true)}
        >
          <EyeOff />
        </Button>
      </div>
    </div>
  )
}

export default SyncTargetNavigation
