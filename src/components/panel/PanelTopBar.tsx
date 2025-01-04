import { FC } from 'react';

import TextViewsToggle from '@/components/panel/TextViewsToggle';
import CustomHTML from '@/components/CustomHTML';
import { tree } from '@/utils/icons'

interface PanelTopBarProps {
    panelIndex: number
}

const PanelTopBar: FC <PanelTopBarProps>= ({panelIndex}) => {
  
  return (
    <div className="panel-top-bar t-mb-6 t-flex">
      <button className="t-h-8 t-w-10">
        <CustomHTML textHtml={tree} width="100" elementType='icon' />
      </button>
      <TextViewsToggle panelIndex = {panelIndex} />
    </div>
  );
};

export default PanelTopBar;