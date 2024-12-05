import { useEffect, FC } from 'react';

interface ErrorProps {
    title?: string,
    message: string | boolean
}

const Error: FC<ErrorProps> = ({ title, message }) => {

  useEffect(() => {
    
  }, []);

  return <div className="t-flex-col t-items-center t-border-2 t-rounded-md t-p-1 t-border-slate-400">
            <span>{title ? title: ''}</span>
            <span>{message}</span>
        </div>;
            
};
export default Error; 