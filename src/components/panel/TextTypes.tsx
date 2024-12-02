import { FC, useState, useEffect, useContext } from 'react';
import { ConfigContext } from '@/contexts/ConfigContext';
import { Button } from 'primereact/button';

const TextTypes: FC = ({ textTypes, activeText, setActiveText }) => {
  const { config, setConfig, openedPanels } = useContext(ConfigContext);

  function handleTextTabClick(e) {
    e.preventDefault();
    setActiveText(() => e.target.innerHTML);
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
  useEffect(() => {}, []);

  return (
    <div className="buttons-text-views t-bg-gray-400 t-p-[3px] t-rounded-[6px] t-h-[35px]">
      {buttons}
    </div>
  );
};

export default TextTypes;
