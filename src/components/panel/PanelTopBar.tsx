import { FC } from 'react';

import TextViewsToggle from '@/components/panel/TextViewsToggle';

interface PanelTopBarProps {
    panelIndex: number
}


const PanelTopBar: FC <PanelTopBarProps>= ({panelIndex}) => {
  

  const textViewsTitles = ['text-v-1', 'text-v-2', 'text-v-3', 'text-v-4']

  return (
    <div className="">
      <TextViewsToggle panelIndex = {panelIndex} />
    </div>
  );
};

export default PanelTopBar;