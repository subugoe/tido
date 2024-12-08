import { FC, useEffect } from 'react';
import Panel from '@/components/panel/Panel';
import { useConfig } from '@/contexts/ConfigContext';
import { getManifestUrl, getCollectionUrl } from '@/utils/panel';

const PanelsWrapper: FC = ({}) => {
  const { config, openedPanels, setOpenedPanels } = useConfig();

  function initOpenedPanels(panels: PanelConfig[]) {
    if (setOpenedPanels) {
      setOpenedPanels(panels);
    }
  }

  useEffect(() => {
    if (!config || !config.panels) {
      console.error('Please provide the config object or the panels array in config')
      return
    }
    initOpenedPanels(config.panels);
  }, []);

  
  const panels = openedPanels ?
    openedPanels.length > 0 &&
    openedPanels.map((panel: PanelConfig, i: number) => (
      <div key={i} className="t-mr-6">
        <Panel url={ panel.collection ? getCollectionUrl(panel): getManifestUrl(panel)} />
      </div>
    )): <div> Error with loading panels </div>;

  
  return <div className="t-flex t-flex-row">{panels}</div>;
};

export default PanelsWrapper;