import { FC, useRef, useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Check, Copy, Share2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import { useTranslation } from 'react-i18next'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { createContentState, encode } from '@/utils/bookmarking.ts'
import { Input } from '@/components/ui/input.tsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx'

const Share: FC = () => {
  const { t } = useTranslation()
  const [showPopover, setShowPopover] = useState(false)
  const [link, setLink] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  const inputRef = useRef(null)
  async function generate() {
    setShowPopover(true)
    const panelStates = usePanelStore.getState().panels
    const contentState = createContentState(panelStates)
    const encoded = await encode(contentState)
    const url = new URL(window.location.href)

    url.searchParams.set('tido', encoded)
    setLink(url.toString())
  }

  async function copyLink() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(inputRef.current.value)
      } else {
        // Fallback for older browsers
        inputRef.current.value.select()
        document.execCommand('copy')
      }
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 4000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <TooltipProvider delayDuration={400}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" onClick={generate}><Share2 /></Button>
          </TooltipTrigger>
          <TooltipContent>
            <span className="leading-none">{ t('generate_share_url') }</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog
        open={showPopover}
        onOpenChange={(isOpen) => setShowPopover(isOpen)}
        modal={true}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{ t('share_this_view') }</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="flex gap-2">
              <Input ref={inputRef} value={link} readOnly />
              <Button variant={isCopied ? 'success' : 'default'} onClick={copyLink}>
                { isCopied ? <Check /> : <Copy /> }
                { isCopied ? t('copied') : t('copy_link') }
              </Button>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Share
