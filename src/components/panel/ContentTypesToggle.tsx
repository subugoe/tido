import { FC, MouseEvent } from 'react';
import { Button } from 'primereact/button';

interface ContentTypesToggleProps {
  textTypes: string[],
  activeText: string,
  setActiveText: (text: string) => void
}


const ContentTypesToggle: FC <ContentTypesToggleProps>= ({ textTypes, activeText, setActiveText }) => {
  function handleTextTabClick(e:MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setActiveText((e.target as HTMLButtonElement).innerHTML);
  }

  const buttons =
    textTypes.length > 0 &&
    textTypes.map((type, i) => (
      <Button
        className="t-p-[5px] t-rounded-[6px]"
        style={{ backgroundColor: activeText === type ? '#FFFFFF' : '' }}
        key={i}
        label={type}
        onClick={(e) => handleTextTabClick(e)}
      />
    ));

  return (
    <div className="buttons-text-views t-bg-gray-400 t-p-[3px] t-rounded-[6px] t-h-[35px]">
      {buttons}
    </div>
  );
};

export default ContentTypesToggle;
