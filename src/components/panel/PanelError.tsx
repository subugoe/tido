import { FC, useEffect, useState } from 'react'
import { CircleX } from 'lucide-react'
import { FallbackProps } from 'react-error-boundary'
import { CustomError } from '@/contexts/PanelContext.tsx'
import { ANNOTATION_PANEL_WIDTH, MIN_PANEL_WIDTH, PANEL_GAP } from '@/utils/panel.ts'

interface Props {
  error: CustomError
  resetErrorBoundary: () => void
}
const PanelError: FC<FallbackProps> = ({ error }: Props) => {

  const [width, setWidth] = useState(null)

  useEffect(() => {
    const wrapper = document.getElementById('panels-wrapper')

    const wrapperStyle = window.getComputedStyle(wrapper)
    const totalWidth = parseFloat(wrapperStyle.width)
    const paddingLeft = parseFloat(wrapperStyle.paddingLeft) || 0
    const paddingRight = parseFloat(wrapperStyle.paddingRight) || 0
    const wrapperWidth = totalWidth - paddingLeft - paddingRight

    const panels = ([...wrapper.querySelectorAll('.panel')] as HTMLElement[])
    const amountPanels = panels.length
    const placeholderWidth = (wrapper.querySelector('[data-panel-placeholder]') as HTMLElement)?.offsetWidth ?? 0
    const amountGaps = placeholderWidth > 0 ? amountPanels : amountPanels - 1
    const baseWidth = (wrapperWidth - placeholderWidth - ANNOTATION_PANEL_WIDTH - (PANEL_GAP * amountGaps)) / amountPanels
    const finalWidth = Math.max(baseWidth, MIN_PANEL_WIDTH)

    setWidth(finalWidth)
  }, [])

  return <div className="panel overflow-hidden grow-0 shrink-0 border-2 border-border rounded-lg p-3" style={{ width }} >
    <div className="h-full flex flex-col items-center py-3 px-8 bg-red-50 dark:bg-red-300/20 rounded-lg">
      <CircleX className="text-red-500 mt-[15vh]" size="60" />
      <span className="mt-4 font-semibold text-red-900 dark:text-red-50">{ error.name }</span>
      <span className="mt-2 text-red-800/60 dark:text-red-50/50 text-center text-sm break-all">{ error.message }</span>
    </div>
  </div>
}

export default PanelError
