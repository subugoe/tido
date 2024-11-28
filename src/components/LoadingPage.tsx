import { FC, useState, useEffect, useContext } from "react";
import { ConfigContext } from "@/contexts/ConfigContext";

import { ProgressSpinner } from "primereact/progressspinner";

const LoadingPage: FC = ({}) => {
  const { config, setConfig, treeNodes } = useContext(ConfigContext);
  const [nodes, setNodes] = useState(treeNodes);

  useEffect(() => {}, []);
  return (
    <div>
      <ProgressSpinner />
    </div>
  );
};

export default LoadingPage;
