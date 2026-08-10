import { FC, useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, EyeOff } from 'lucide-react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import NavigationButton from '@/components/panel/synopsis/NavigationButton.tsx'
import NavigationCollapsed from '@/components/panel/synopsis/NavigationCollapsed.tsx'
import { useSynopsisStore } from '@/store/SynopsisStore.tsx'
import { getSyncedTargets } from '@/utils/annotations.ts'
import { scrollIntoViewIfNeeded } from '@/utils/dom.ts'
import { PANEL_BORDER_WIDTH, SYNC_NAVIGATION_POSITION } from '@/utils/constants.ts'

const VERTICAL_OFFSET = '-translate-y-[calc(100%-6px)]'

const SyncTargetNavigation: FC = () => {
  const { panelId, syncedTargets, syncedTargetsMap, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
  const activeSynopsisConnection = useSynopsisStore(state => state.activeSynopsisConnection)
  const setActiveSynopsisConnection = useSynopsisStore(state => state.setActiveSynopsisConnection)
  const syncAnnotationsBySource = useSynopsisStore(state => state.syncAnnotationsBySource)
  const [navigatedTargetIndex, setNavigatedTargetIndex] = useState(0)
  const [collapsed, setCollapsed] = useState(false)
  const [centerX, setCenterX] = useState(0)

  // The navigation sits next to the panel card, so it cannot inherit the width of the main content
  // it belongs to. Track that width instead and center the navigation on it - opening the sidebar
  // widens the panel to the right while the main content keeps its width, so the navigation stays.
  useEffect(() => {
    const mainContentEl = document.getElementById(panelId)?.querySelector('.main-content')
    if (!mainContentEl) return

    const observer = new ResizeObserver(([entry]) => {
      setCenterX(PANEL_BORDER_WIDTH + entry.contentRect.width / 2)
    })
    observer.observe(mainContentEl)

    return () => observer.disconnect()
  }, [panelId])

  // The source (content url) the given sync target belongs to - the key of syncedTargetsMap whose
  // targets contain it. Needed to resolve a target's sync annotations.
  function findTargetSource(target: HTMLElement): string | undefined {
    return Object.keys(syncedTargetsMap).find((contentUrl) => syncedTargetsMap[contentUrl]?.includes(target))
  }

  // This panel's target of the active connection: its navigated target when the connection started
  // here, otherwise the connection's synced target that lives in one of this panel's texts.
  function findConnectionTargetIndex(syncedTargets: HTMLElement[]) {
    const { navigatedTarget, otherSyncedTargets } = activeSynopsisConnection

    const navigatedIndex = navigatedTarget ? syncedTargets.indexOf(navigatedTarget) : -1
    if (navigatedIndex !== -1) return navigatedIndex

    return syncedTargets.findIndex((el) => otherSyncedTargets.some((syncedTarget) =>
      syncedTargetsMap[syncedTarget.source.id]?.includes(el) && el.matches(syncedTarget.selector)
    ))
  }

  // Move the counter to this panel's target of the connection, whichever panel established it -
  // by clicking a sync target, scrolling or the arrows.
  useEffect(() => {
    if (!activeSynopsisConnection) {
      setNavigatedTargetIndex(0)
      return
    }
    const matchIndex = findConnectionTargetIndex(syncedTargets)
    if (matchIndex !== -1) {
      setNavigatedTargetIndex(matchIndex)
      return
    }

    // otherwise just keep the index within range when the set of targets shrinks, i.e when toggling off a panel view text
    const newNavigatedIndex = syncedTargets.length === 0 ? 0 : Math.min(navigatedTargetIndex, syncedTargets.length - 1)
    setNavigatedTargetIndex(newNavigatedIndex)
  }, [activeSynopsisConnection, syncedTargets])



  const total = syncedTargets.length
  if (total === 0) return null

  const isFirst = navigatedTargetIndex === 0
  const isLast = navigatedTargetIndex === total - 1


  function goToTarget(index: number, syncedTargets: HTMLElement[]) {
    // clamp to the boundaries - the arrows are disabled at the ends, so no wrap-around
    const nextIndex = Math.max(0, Math.min(index, syncedTargets.length - 1))
    if (nextIndex === navigatedTargetIndex) return

    const target = syncedTargets[nextIndex]
    const source = findTargetSource(target)
    const otherSyncedTargets = source
      ? getSyncedTargets(target, source, syncAnnotationsBySource.get(source) ?? [])
      : []

    // Scroll the target into view first: the other panels align their own targets to where it ends
    // up, so yPos must be derived from the scrollTop the container settles at, not its current one.
    const scrollContainer = target.closest('[data-text-container]') as HTMLElement | null
    let yPos = 0
    if (scrollContainer) {
      const finalScrollTop = scrollIntoViewIfNeeded(target, scrollContainer)
      const offsetTop = target.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top + scrollContainer.scrollTop
      yPos = offsetTop - finalScrollTop
    }

    setActiveSynopsisConnection({ navigatedTarget: target, otherSyncedTargets, yPos })
  }


  if (collapsed) return <NavigationCollapsed onOpen={() => setCollapsed(false)} centerX={centerX} />

  return (
    <div
      className={`${SYNC_NAVIGATION_POSITION} ${VERTICAL_OFFSET}`}
      style={{ left: `${centerX}px` }}
      data-cy="sync-target-navigation"
    >
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
