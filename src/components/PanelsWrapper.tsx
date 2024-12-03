import { FC, useState, useEffect, useContext } from 'react';
import Panel from '@/components/panel/Panel';
import { useConfig } from '@/contexts/ConfigContext';
import { getPanelUrl } from '@/utils/panel';

const PanelsWrapper: FC = ({}) => {
  const { config, updateConfig, openedPanels, setOpenedPanels } = useConfig();

  function initOpenedPanels(panels) {
    setOpenedPanels(panels);
  }

  useEffect(() => {
    initOpenedPanels(config.panels);
  }, []);

  const panels =
    openedPanels.length > 0 &&
    openedPanels.map((panel, i) => (
      <div key={i} className="t-mr-[25px]">
        <Panel url={getPanelUrl(panel)} />
      </div>
    ));

  return <div className="t-flex t-flex-row">{panels}</div>;
};

export default PanelsWrapper;
