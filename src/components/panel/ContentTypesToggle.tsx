import { FC, MouseEvent } from 'react';
import { Button } from 'primereact/button';

interface ContentTypesToggleProps {
  contentTypes: string[],
  activeContentType: string,
  setActiveContentType: (text: string) => void
}


const ContentTypesToggle: FC <ContentTypesToggleProps>= ({ contentTypes, activeContentType, setActiveContentType }) => {
  function handleTextTabClick(e:MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setActiveContentType((e.target as HTMLButtonElement).innerHTML);
  }

  const buttons =
  contentTypes.length > 0 &&
  contentTypes.map((type, i) => (
      <Button
        className="t-p-1 t-rounded"
        style={{ backgroundColor: activeContentType === type ? '#FFFFFF' : '' }}
        key={i}
        label={type}
        onClick={(e) => handleTextTabClick(e)}
      />
    ));

  return (
    <div className="buttons-text-views t-bg-gray-400 t-p-1 t-rounded-md t-h-8">
      {buttons}
    </div>
  );
};

export default ContentTypesToggle;
