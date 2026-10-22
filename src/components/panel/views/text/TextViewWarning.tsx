import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import { TriangleAlert } from 'lucide-react'
import { useTextView } from '@/contexts/TextViewContext.tsx'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx'

// One bar for all the problems of the text: the first one is shown, the tooltip lists them all
const TextViewWarning: FC = () => {
  const { usePanelTranslation, panelRootRef } = usePanel()
  const { textWarnings, clearTextWarnings } = useTextView()

  const { t } = usePanelTranslation()

  if (textWarnings.length === 0) return null

  const messages = textWarnings.map(key => t(key))
  const moreCount = messages.length - 1

  return <div className="flex bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-100 items-center p-2 w-full">
    <TriangleAlert size={15} className="shrink-0" />
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="ml-2 mr-3 flex min-w-0 items-center gap-2 text-sm">
          <span className="truncate">{ messages[0] }</span>
          { moreCount > 0 && <span className="shrink-0 rounded-full bg-amber-200 dark:bg-amber-700 px-1.5 text-xs font-semibold">+{ moreCount }</span> }
        </span>
      </TooltipTrigger>
      <TooltipContent container={panelRootRef.current} className="max-w-80">
        { messages.length === 1
          ? <span>{ messages[0] }</span>
          : <ul className="list-disc pl-4 space-y-1">
            { messages.map(message => <li key={message}>{ message }</li>) }
          </ul> }
      </TooltipContent>
    </Tooltip>
    <Button variant="ghostAmber" className="ml-auto" size="sm" onClick={clearTextWarnings}>{ t('dismiss') }</Button>
  </div>
}

export default TextViewWarning
