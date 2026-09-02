import { FC, useRef, useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Check, Copy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { createContentState, encodeState } from '@/utils/bookmarking.ts'
import { Input } from '@/components/ui/input.tsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx'

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ShareDialog: FC<ShareDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation()
  const [link, setLink] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  const inputRef = useRef(null)

  async function generate() {
    const panelStates = usePanelStore.getState().panels
    const contentState = createContentState(panelStates)
    const encoded = await encodeState(contentState)
    const url = new URL(window.location.href)

    url.searchParams.set('tido', encoded)
    setLink(url.toString())
  }

  async function copyLink() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(inputRef.current.value)
      } else {
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
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      modal={true}
    >
      <DialogContent onOpenAutoFocus={generate}>
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
  )
}

export default ShareDialog
