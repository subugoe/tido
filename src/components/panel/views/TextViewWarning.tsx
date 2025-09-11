import { FC, useEffect, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import { TriangleAlert } from 'lucide-react'

const TextViewWarning: FC = () => {
  const { textWarning, setTextWarning, usePanelTranslation } = usePanel()
  const [visible, setVisible] = useState(false)

  const { t } = usePanelTranslation()

  useEffect(() => {
    setVisible(textWarning !== '')
  }, [textWarning])

  return <>
    { visible && <div className="flex bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-100 items-center p-2 w-full">
      <TriangleAlert size={15} className="shrink-0" />
      <span className="ml-2 mr-3 truncate text-sm" title={textWarning}>{ textWarning }</span>
      <Button variant="ghostAmber" className="ml-auto" size="sm" onClick={() => setTextWarning('')}>{ t('dismiss') }</Button>
    </div> }
  </>
}

export default TextViewWarning
