import { FC, useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import NavigationButton from '@/components/panel/synopsis/NavigationButton.tsx'
import BaseTooltip from '@/components/base/BaseTooltip.tsx'
import { useSynopsisStore } from '@/store/SynopsisStore.tsx'
import { getSyncedTargets } from '@/utils/annotations.ts'
import { scrollIntoViewIfNeeded } from '@/utils/dom.ts'

const SyncTargetNavigation: FC = () => {
  const { panelState, syncedTargets, syncedTargetsMap, usePanelTranslation } = usePanel()
  const { showSynopsisNavigation } = useConfig()
  const { t } = usePanelTranslation()
  const activeSynopsisConnection = useSynopsisStore(state => state.activeSynopsisConnection)
  const setActiveSynopsisConnection = useSynopsisStore(state => state.setActiveSynopsisConnection)
  const syncAnnotationsBySource = useSynopsisStore(state => state.syncAnnotationsBySource)
  const [navigatedTargetIndex, setNavigatedTargetIndex] = useState(0)

  function findTargetSource(target: HTMLElement): string | undefined {
    return Object.keys(syncedTargetsMap).find((contentUrl) => syncedTargetsMap[contentUrl]?.includes(target))
  }

  function findConnectionTargetIndex(syncedTargets: HTMLElement[]) {
    const { navigatedTarget, otherSyncedTargets } = activeSynopsisConnection

    const navigatedIndex = navigatedTarget ? syncedTargets.indexOf(navigatedTarget) : -1
    if (navigatedIndex !== -1) return navigatedIndex

    return syncedTargets.findIndex((el) => otherSyncedTargets.some((syncedTarget) =>
      syncedTargetsMap[syncedTarget.source.id]?.includes(el) && el.matches(syncedTarget.selector)
    ))
  }

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

    const newNavigatedIndex = syncedTargets.length === 0 ? 0 : Math.min(navigatedTargetIndex, syncedTargets.length - 1)
    setNavigatedTargetIndex(newNavigatedIndex)
  }, [activeSynopsisConnection, syncedTargets])

  const total = syncedTargets.length
  if ((panelState.config.showSynopsisNavigation ?? showSynopsisNavigation) === false) return null
  if (total === 0) return null

  const isFirst = navigatedTargetIndex === 0
  const isLast = navigatedTargetIndex === total - 1

  function goToTarget(index: number, syncedTargets: HTMLElement[]) {
    const nextIndex = Math.max(0, Math.min(index, syncedTargets.length - 1))
    if (nextIndex === navigatedTargetIndex) return

    const target = syncedTargets[nextIndex]
    const source = findTargetSource(target)
    const otherSyncedTargets = source
      ? getSyncedTargets(target, source, syncAnnotationsBySource.get(source) ?? [])
      : []

    const scrollContainer = target.closest('[data-text-container]') as HTMLElement | null
    let yPos = 0
    if (scrollContainer) {
      const finalScrollTop = scrollIntoViewIfNeeded(target, scrollContainer)
      const offsetTop = target.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top + scrollContainer.scrollTop
      yPos = offsetTop - finalScrollTop
    }

    setActiveSynopsisConnection({ navigatedTarget: target, otherSyncedTargets, yPos })
  }

  return (
    <div className="flex items-center gap-1" data-cy="sync-target-navigation">
      <BaseTooltip message={t('previous_synoptic_target')}>
        <NavigationButton
          isDisabled={isFirst}
          ariaLabel={t('previous_synoptic_target')}
          onSelect={() => goToTarget(navigatedTargetIndex - 1, syncedTargets)}
        >
          <ChevronUp />
        </NavigationButton>
      </BaseTooltip>
      <span className="text-xs font-medium text-muted-foreground min-w-[2.5rem] text-center" data-cy="sync-target-counter">
        {navigatedTargetIndex + 1}/{total}
      </span>
      <BaseTooltip message={t('next_synoptic_target')}>
        <NavigationButton
          isDisabled={isLast}
          ariaLabel={t('next_synoptic_target')}
          onSelect={() => goToTarget(navigatedTargetIndex + 1, syncedTargets)}
        >
          <ChevronDown />
        </NavigationButton>
      </BaseTooltip>
    </div>
  )
}

export default SyncTargetNavigation
