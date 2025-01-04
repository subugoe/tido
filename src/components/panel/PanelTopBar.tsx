import { FC, useRef, } from 'react';

import TextViewsToggle from '@/components/panel/TextViewsToggle';
import CustomHTML from '@/components/CustomHTML';
import { tree } from '@/utils/icons'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface PanelTopBarProps {
    panelIndex: number
}

const PanelTopBar: FC <PanelTopBarProps>= ({panelIndex}) => {

  return (
    <div className="panel-top-bar t-mb-6 t-flex">
      <Popover>
        <PopoverTrigger className="open-tree-button t-h-8 t-w-10 t-relative">
            <CustomHTML textHtml={tree} width="100" elementType='icon' />
        </PopoverTrigger>
          <PopoverContent className="t-bg-white t-absolute">
              <div className="t-flex t-flex-col t-pt-4 t-pl-3 t-w-80 t-shadow-md t-border-[1px] t-border-solid t-border-gray-300 t-rounded-md">
                <span className="t-font-bold">
                  Enter a collection/manifest Url
                </span>
                <input
                  className="t-border-solid t-border-[1.5px] t-w-[200px] t-h-[30px] t-mb-[10px]"
                />
                <span>Or choose:</span>
              </div>
          </PopoverContent>
      </Popover>
      
      <TextViewsToggle panelIndex = {panelIndex} />
    </div>
  );
};

export default PanelTopBar;