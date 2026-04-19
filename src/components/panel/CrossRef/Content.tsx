import React, { FC } from 'react'
import CrossRefError from '@/components/panel/CrossRef/CrossRefError.tsx'
import CrossRefTitle from '@/components/panel/CrossRef/CrossRefTitle.tsx'
import { ExternalLink } from 'lucide-react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { CustomError } from '@/utils/custom-error.ts'
import { Button } from '@/components/ui/button.tsx'

interface Props {
  error: CustomError,
  manifestLabel: string,
  itemLabel: string,
  contentType: string
  actionLabelThisPanel: string
  actionNewPanel: (e: React.MouseEvent<HTMLButtonElement>) => void,
  actionThisPanel: (e: React.MouseEvent<HTMLButtonElement>) => void,
}

const Content: FC<Props> = ({ error, manifestLabel, itemLabel, contentType, actionLabelThisPanel, actionNewPanel, actionThisPanel }) => {

  const { usePanelTranslation, panelState } = usePanel()
  const { showCrossRefLabels } = useConfig()
  const { t } = usePanelTranslation()

  const content = error ?
    <CrossRefError error={error} />
    :  <>
      {showCrossRefLabels && <CrossRefTitle
        contentType={panelState.contentTypes.length > 1 ? t(contentType) : ''}
        manifestLabel={manifestLabel}
        itemLabel={itemLabel}
      />}
      <div className="mt-2">
        <Button variant="ghost" className="pl-3 w-full" onClick={(e) => actionThisPanel(e)}>{actionLabelThisPanel}</Button>
        <Button variant="ghost" className="w-full" onClick={(e) => actionNewPanel(e)}>{t('open_in_new_panel')} <ExternalLink size={16} className="inline" /></Button>
      </div>
    </>

  return  <div className="w-full">{content}</div>
}

export default Content
