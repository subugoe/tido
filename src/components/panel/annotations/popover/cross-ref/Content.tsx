import React, { FC } from 'react'
import CrossRefError from '@/components/panel/annotations/popover/cross-ref/CrossRefError.tsx'
import CrossRefTitle from '@/components/panel/annotations/popover/cross-ref/CrossRefTitle.tsx'
import { Plus, RefreshCcw } from 'lucide-react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { CustomError } from '@/utils/custom-error.ts'
import { Button } from '@/components/ui/button.tsx'

interface Props {
  error: CustomError,
  manifestLabel: string,
  itemLabel: string,
  // the referenced content type, named in the title - undefined when there is no need to name it
  contentType?: string
  actionLabelThisPanel: string
  actionNewPanel: (e: React.MouseEvent<HTMLButtonElement>) => void,
  actionThisPanel: (e: React.MouseEvent<HTMLButtonElement>) => void,
}

const Content: FC<Props> = ({ error, manifestLabel, itemLabel, contentType, actionLabelThisPanel, actionNewPanel, actionThisPanel }) => {

  const { usePanelTranslation } = usePanel()
  const { showCrossRefLabels } = useConfig()
  const { t } = usePanelTranslation()

  const content = error ?
    <CrossRefError error={error} />
    :  <>
      {showCrossRefLabels && <CrossRefTitle
        contentType={contentType ? t(contentType) : ''}
        manifestLabel={manifestLabel}
        itemLabel={itemLabel}
      />}
      <div className="flex gap-2 mt-2">
        <Button
          variant="muted"
          size="sm"
          onClick={(e) => actionThisPanel(e)}>
          <RefreshCcw size={16} />
          {actionLabelThisPanel}
        </Button>
        <Button
          variant="muted"
          size="sm"
          onClick={(e) => actionNewPanel(e)}>
          <Plus size={16} />
          {t('open_in_new_panel')}
        </Button>
      </div>
    </>

  return  <div className="w-full">{content}</div>
}

export default Content
