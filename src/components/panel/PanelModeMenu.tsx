import { FC, useEffect, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { PictureInPicture2, Image, AlignCenter, Columns2 } from 'lucide-react'
import { PanelModeButtonData, PanelMode } from '@/types'
import { filterAndSortData } from '@/utils/panel.ts'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx'
import BaseTooltip from '@/components/base/BaseTooltip.tsx'


const PanelModeMenu: FC = () => {
  const { panelState, updatePanel, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
  const { panelModes } = useConfig()
  const [selected, setSelected] = useState<PanelMode>(panelState.mode)
  const [visiblePanelModesData, setVisiblePanelModesData] = useState<PanelModeButtonData[]>([])

  useEffect(() => {
    const data = filterAndSortData(defaultButtonsData, 'mode', panelModes)
    setVisiblePanelModesData(data)
  }, [])

  useEffect(() => {
    if (!panelState) return
    updatePanel({ mode: selected })
  }, [selected])


  const defaultButtonsData: PanelModeButtonData[] = [{
    mode: 'swap',
    icon: PictureInPicture2,
    title: t('swap')
  }, {
    mode: 'split',
    icon: Columns2,
    title: t('split')
  }, {
    mode: 'text',
    icon: AlignCenter,
    title: t('text')
  }, {
    mode: 'image',
    icon: Image,
    title: t('image')
  }]

  function isDisabled(buttonPanelMode: PanelMode) {
    return (!panelState.imageExists && ['image', 'swap', 'split'].includes(buttonPanelMode))
      || !panelState.contentTypes?.length
  }

  return <>
    {!panelState && <Skeleton />}
    {panelState && visiblePanelModesData.length > 1 &&
      <>
        <Select
          value={selected}
          onValueChange={(value) => setSelected(value as PanelMode)}
        >
          <BaseTooltip message={t('switch_panel_mode')}>
            <SelectTrigger size="sm" data-cy="panel-mode-select" className="[&_span]:hidden">
              <SelectValue />
            </SelectTrigger>
          </BaseTooltip>
          <SelectContent data-cy="panel-mode-menu">
            <SelectGroup>
              <SelectLabel>{ t('panel_modes') }</SelectLabel>
              {visiblePanelModesData.map((button) => {
                const Icon = button.icon

                return <SelectItem
                  value={button.mode}
                  disabled={isDisabled(button.mode)}
                  data-selected={panelState.mode === button.mode}
                  data-cy={button.mode}
                  className="cursor-pointer"
                >
                  <Icon />
                  <span className={`leading-none ml-1 ${panelState.mode === button.mode ? 'font-medium' : ''}`}>{button.title}</span>
                </SelectItem>
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </>
    }
  </>
}

export default PanelModeMenu
