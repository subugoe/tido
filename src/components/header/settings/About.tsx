import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog.tsx'
import packageJson from '@/../package.json'
import { Button } from '@/components/ui/button.tsx'
import { Book, Bug, CodeXml, ExternalLink } from 'lucide-react'

const REPOSITORY_URL = 'https://github.com/subugoe/tido'
const LICENSE_URL = 'https://github.com/subugoe/tido/blob/main/LICENSE'
const README_URL = 'https://github.com/subugoe/tido/blob/main/README.md'
interface Props {
  show: boolean,
  onClose: () => void
}
const About: FC<Props> = ({ show = false, onClose }) => {
  const { t } = useTranslation()
  return <>
    <Dialog
      open={show}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
      modal={true}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ t('about_tido') }</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {t('tido_description')}
          <p className="mt-1"><span>{t('version')}:</span> <span className="font-normal">{packageJson.version}</span></p>
        </DialogDescription>
        <div className="flex flex-col">
          <p className="mt-4">
            <span>{t('licensed_under') }</span>
            <Button variant="link" asChild><a href={LICENSE_URL} target="_blank">GNU Affero General Public License v3.0 <ExternalLink /></a></Button>
          </p>
          <p className="">
            <span>{ t('copyright') }</span> <span>{ t('sub') }</span>
          </p>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button variant="accent" asChild>
            <a href={README_URL} target="_blank"><Book />{ t('documentation') }</a>
          </Button>
          <Button variant="accent" asChild>
            <a href={REPOSITORY_URL} target="_blank"><CodeXml /> { t('source_code') }</a>
          </Button>
          <Button variant="accent" asChild>
            <a href={packageJson.bugs.url} target="_blank"><Bug />{ t('report_bug') }</a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
}

export default About
