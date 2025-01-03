import { FC } from 'react';

import TextViewsToggle from '@/components/panel/TextViewsToggle';

interface PanelTopBarProps {
    panelIndex: number
}

const PanelTopBar: FC <PanelTopBarProps>= ({panelIndex}) => {
  
  return (
    <div className="panel-top-bar">
      <TextViewsToggle panelIndex = {panelIndex} />
    </div>
  );
};

export default PanelTopBar;