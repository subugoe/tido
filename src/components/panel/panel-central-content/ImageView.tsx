import { FC } from 'react';
import { useConfig } from '@/contexts/ConfigContext'



const ImageView: FC = () => {
    const {config} = useConfig()


  return (
    <div className="">
        <div className="t-flex">
             <div>
                 <img className=""src={config?.itemImageUrl} />
             </div>
        </div>
      
    </div>
  );
};

export default ImageView;
