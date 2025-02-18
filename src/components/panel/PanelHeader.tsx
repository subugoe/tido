import { FC } from 'react'

import TextViewsToggle from '@/components/panel/TextViewsToggle'
import CustomHTML from '@/components/CustomHTML'
import { tree } from '@/utils/icons'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import PanelTitle from '@/components/panel/PanelTitle.tsx'
import ContentTypesToggle from '@/components/panel/ContentTypesToggle.tsx'

const PanelHeader: FC = () => {
  return (
    <div className="panel-header t-flex t-flex-col t-mb-6">
      <div className="t-flex t-mb-6">
        <Popover>
          <PopoverTrigger className="open-tree-button t-h-8 t-w-10 t-relative">
            <CustomHTML
              textHtml={tree}
              icon={{ type: 'icon', width: 6, height: 6 }}
            />
          </PopoverTrigger>
          <PopoverContent className="t-bg-white t-absolute t-z-10">
            <div
              className="t-flex t-flex-col t-pt-4 t-pl-3 t-w-80 t-shadow-md t-border-[1px] t-border-solid t-border-gray-300 t-rounded-md">
              <span className="t-font-bold">Enter a collection/manifest Url</span>
              <input className="t-border-solid t-border-[1.5px] t-w-[200px] t-h-[30px] t-mb-[10px]" />
              <span>Or choose:</span>
            </div>
          </PopoverContent>
        </Popover>
        <TextViewsToggle />
      </div>
      <div className="t-flex t-justify-center t-mb-4">
        <PanelTitle />
      </div>
      <div className="t-flex t-justify-center">
        <ContentTypesToggle />
      </div>
    </div>
  )
}

export default PanelHeader
