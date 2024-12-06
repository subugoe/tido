import { FC, MouseEvent } from 'react';
import { Button } from 'primereact/button';

interface ContentTypesToggleProps {
  contentTypes: string[],
  activeContentTypeIndex: number,
  setActiveContentTypeIndex: (index: number) => void
}


const ContentTypesToggle: FC <ContentTypesToggleProps>= ({ contentTypes, activeContentTypeIndex, setActiveContentTypeIndex }) => {
  function handleTextTabClick(e:MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const activeContentType: string = (e.target as HTMLButtonElement).innerHTML
    const index: number = contentTypes.findIndex((type) => type === activeContentType)
    if (index === -1) return
    setActiveContentTypeIndex(index);
  }

  const buttons =
  contentTypes.length > 0 &&
  contentTypes.map((type, i) => (
      <Button
        className="t-p-1 t-rounded"
        style={{ backgroundColor: activeContentTypeIndex === i ? '#FFFFFF' : '' }}
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
