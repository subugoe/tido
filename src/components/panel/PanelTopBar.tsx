import { FC } from 'react';

import TextViewsToggle from '@/components/panel/TextViewsToggle';

interface PanelTopBarProps {
}


const PanelTopBar: FC <PanelTopBarProps>= ({}) => {
  

  const textViewsTitles = ['text-v-1', 'text-v-2', 'text-v-3', 'text-v-4']

  return (
    <div className="">
      <TextViewsToggle />
    </div>
  );
};

export default PanelTopBar;
