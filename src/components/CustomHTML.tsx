import { useEffect, useRef, FC } from 'react';

interface CustomHTMLProps {
  textHtml: string
}

const CustomHTML: FC<CustomHTMLProps> = ({ textHtml }) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref?.current) {
    (ref.current as HTMLElement).innerHTML = textHtml;
    }
  }, [textHtml]);

  return <div ref={ref} />;
};
export default CustomHTML;
