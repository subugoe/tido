import { FC, ReactNode, useEffect, useRef } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import ResizeHandle from '@/components/panel/ResizeHandle.tsx'
import { useSynopsisStore } from '@/store/SynopsisStore.tsx'
import { waitForElementInDom } from '@/utils/dom.ts'
import { addCrossReferencedElStyle } from '@/utils/text.ts'

interface Props {
  children?: ReactNode
}
const PanelShell: FC<Props> = ({ children }) => {
  const { panelId, panelState, initResizer, getScroller, resizer } = usePanel()
  const ref = useRef(null)

  const syncedTargets = useSynopsisStore((state) => state.syncedTargets)

  useEffect(() => {
    if (!ref.current) return
    initResizer(ref.current)
    getScroller()

    // Scroll to this panel
    const scrollPosX = ref.current.offsetLeft - ref.current.offsetWidth / 2
    document.getElementById('panels-wrapper').scrollTo({ left: scrollPosX, behavior: 'smooth' })

    return () => {
      resizer?.clean()
    }
  }, [])

  // When synced targets are chosen from a synopsis popover, highlight the target in this
  // panel and scroll its container so the synced target sits at the same y-position within
  // the container as the clicked target. Only applies when a view here shows its content.
  useEffect(() => {
    if (!syncedTargets || syncedTargets.targets.length === 0 || !panelState?.item) return

    const { yPos, targets } = syncedTargets

    // content URLs currently shown by this panel's text views
    const shownContentUrls = panelState.panelViews
      .map((view) => view.activeContentType
        ? panelState.item?.contents.find((c) => c.contentType.includes(view.activeContentType))?.id
        : undefined)
      .filter(Boolean)

    targets.forEach((syncedTarget) => {
      if (!shownContentUrls.includes(syncedTarget.source.id)) return

      // wait until the target is rendered inside this panel, then highlight and scroll to it
      waitForElementInDom(`#${panelId}`, syncedTarget.selector, (panelEl) => {
        const targetEl = panelEl.querySelector(syncedTarget.selector) as HTMLElement
        if (!targetEl) return

        addCrossReferencedElStyle(targetEl)

        // scroll so this target's y-position within the container matches the clicked target's
        const scrollContainer = targetEl.closest('[data-text-container]') as HTMLElement
        if (scrollContainer) {
          const currentY = targetEl.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top
          const desiredScrollTop = scrollContainer.scrollTop + currentY - yPos
          const maxScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight
          scrollContainer.scrollTo({ top: Math.max(0, Math.min(desiredScrollTop, maxScrollTop)), behavior: 'smooth' })
        }
      })
    })
  }, [syncedTargets, panelState?.item, panelState?.panelViews, panelId])

  return <div
    id={panelId}
    ref={ref}
    className={`panel bg-background text-foreground grow-0 shrink-0 relative transition-width`}
    data-cy="panel"
  >
    <div className="h-full overflow-hidden relative border-2 border-border rounded-[16px]">
      { children }
    </div>
    <ResizeHandle className="-right-1.5" data-panel-resize-handle />
  </div>
}

export default PanelShell
