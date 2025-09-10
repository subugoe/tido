import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  contentType: string,
  manifestLabel: string,
  itemLabel: string
}

const CrossRefTitle: FC<Props> = ({ contentType, manifestLabel, itemLabel }) => {

  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()


  return <div className="ml-2 text-sm text-muted-foreground">
    <div>{manifestLabel ?? ''}</div>
    <div>  {itemLabel ?? ''}
      {', ' + t(contentType)}</div>
  </div>
}

export default CrossRefTitle
