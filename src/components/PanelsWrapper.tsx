import { FC, useState, useEffect, useContext } from "react";
import { ConfigContext } from "@/contexts/ConfigContext";
import Panel from "@/components/panel/Panel";

import { getPanelUrl } from "@/utils/panel";

const PanelsWrapper: FC = ({}) => {
  const { config, setConfig, openedPanels } = useContext(ConfigContext);

  const panels =
    openedPanels.length > 0 &&
    openedPanels.map((panel, i) => (
      <div key={i} className="t-mr-[25px]">
        <Panel url={getPanelUrl(panel)} />
      </div>
    ));
  useEffect(() => {}, []);

  return <div className="t-flex t-flex-row">{panels}</div>;
};

export default PanelsWrapper;
