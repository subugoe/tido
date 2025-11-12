import { FC, ReactNode } from 'react'
import { Image, Text } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface PreviewProps {
  activeMode?: string,
  onChange?: (value: string) => void,
}

const PreviewButton: FC<{ children?: ReactNode }> = ({ children }) => {
  return <Button
    data-cy='preview-image'
    className="px-2 py-3 h-auto shadow-md bg-background text-primary border-primary hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:bg-primary/4 hover:text-primary"
    variant="outline"
    color="secondary"
  >
    <div className="flex flex-col justify-center items-center">
      { children }
    </div>
  </Button>
}

const Swapper: FC<PreviewProps> = ({ activeMode = 'A', onChange = () => {} }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  function updateMode() {
    if (activeMode === 'A') {
      onChange('B')
      return
    }
    onChange('A')
  }

  const previewA = <PreviewButton>
    <Image className="size-8 mb-2" />
    <div>{t('show_image')}</div>
  </PreviewButton>

  const previewB = <PreviewButton>
    <Text className="size-8 mb-2" />
    <div>{t('show_text')}</div>
  </PreviewButton>

  return (
    <div className="z-20 absolute p-[1px] bottom-12 right-12 transition-all"
      onClick={() => updateMode()}>
      {activeMode === 'A' ? previewA : previewB  }
    </div>
  )
}

export default Swapper
