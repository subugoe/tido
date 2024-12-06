import { FC, useState } from 'react';

import { useConfig } from '@/contexts/ConfigContext'
import CustomHTML from '@/components/CustomHTML';

interface BottomPlaceholder {
}

const BottomPlaceholder: FC = ({ element }) => {

const { config } = useConfig()

const [showText, setShowText] = useState(true)




  return (
    <div className="t-w-12 t-h-12 t-ml-[50%]">
        <button> {element} </button>
    </div>
  );
};

export default BottomPlaceholder;
