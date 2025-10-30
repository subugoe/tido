import { FC } from 'react'
import CrossRefError from '@/components/panel/CrossRef/CrossRefError.tsx'
import { DropdownMenuItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu.tsx'
import CrossRefTitle from '@/components/panel/CrossRef/CrossRefTitle.tsx'
import { ExternalLink } from 'lucide-react'
import { CustomError, usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  error: CustomError,
  node: HTMLElement,
  manifestLabel: string,
  itemLabel: string,
  actionLabelThisPanel: string
  actionNewPanel: () => void,
  actionThisPanel: () => void,
}

const Content: FC<Props> = ({ error, node, manifestLabel, itemLabel, actionLabelThisPanel, actionNewPanel, actionThisPanel }) => {

  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  const content = error ?
    <CrossRefError error={error} />
    :  <>
      <DropdownMenuLabel>
        {t('reference')}
      </DropdownMenuLabel>
      <CrossRefTitle contentType={node.getAttribute('data-ref-content-type')} manifestLabel={manifestLabel} itemLabel={itemLabel} />
      <DropdownMenuItem className="mt-2 cursor-pointer" onSelect={actionThisPanel}>
        <span>{actionLabelThisPanel}</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer" onSelect={actionNewPanel}>
        <span>{t('open_in_new_panel')} <ExternalLink size={16} className="inline" /></span>
      </DropdownMenuItem>
    </>

  return  <>{content}</>
}

export default Content
