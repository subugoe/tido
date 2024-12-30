import { FC } from 'react';

interface ImageViewProps {
  imageUrl: string | undefined
}

const ImageView: FC<ImageViewProps> = ({imageUrl}) => {


  return (
    <div className="">
        <div className="t-flex">
            <div className="t-mr-3">
                    <img className="" src={imageUrl} />
            </div>
        </div>
      
    </div>
  );
};

export default ImageView;