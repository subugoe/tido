import { FC, useEffect, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Image, AlignCenter, FileQuestionMark, Settings2, type LucideIcon } from 'lucide-react'
import BaseTooltip from '@/components/base/BaseTooltip.tsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Switch } from '@/components/ui/switch.tsx'

interface PanelView {
  icon: LucideIcon
  label: string
  visible: boolean
}

const PanelViewsMenu: FC = () => {
  const { panelState, usePanelTranslation, updatePanel } = usePanel()
  const { t } = usePanelTranslation()
  const [data, setData] = useState<PanelView[]>([])

  useEffect(() => {
    const data = panelState.panelViews.map(({ view, label, visible }) => ({
      icon: view === 'text' ? AlignCenter : view === 'image' ? Image : FileQuestionMark,
      label,
      visible
    }))
    setData(data)
  }, [panelState.panelViews])

  function update(index: number, visible: boolean) {
    data[index].visible = visible
    updatePanel({
      panelViews: data.map(({ visible }, i) => ({ ...panelState.panelViews[i], visible }))
    })
  }

  return <>
    {!panelState && <Skeleton />}
    {panelState && data.length > 1 &&
      <>
        <Popover>
          <BaseTooltip message={t('switch_panel_mode')}>
            <PopoverTrigger asChild data-cy="panel-mode-select" className="[&_span]:hidden">
              <Button variant="outline" size="sm"><Settings2 /> { t('view') }</Button>
            </PopoverTrigger>
          </BaseTooltip>
          <PopoverContent data-cy="panel-mode-menu" className="p-1 gap-2">
            {data.map((view, i) => {
              const Icon = view.icon

              return <label className={`flex gap-2 text-sm p-1 hover:bg-muted cursor-pointer rounded-lg`}>
                <Icon size={16} />
                {view.label}
                <Switch
                  className="ml-auto"
                  onCheckedChange={(checked) => update(i, checked)}
                  checked={view.visible}
                />
              </label>
            })}
          </PopoverContent>
        </Popover>
      </>
    }
  </>
}

export default PanelViewsMenu
