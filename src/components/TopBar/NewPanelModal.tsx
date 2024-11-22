import { FC, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import "../../css/style.css";

import TreeView from "../TreeView";

const NewPanelModal: FC = ({ newButton }) => {
  const [value, setValue] = useState("");
  return (
    <OverlayPanel
      ref={newButton}
      appendTo="self"
      style={{
        display: "flex",
        flexDirection: "column",
        border: "2px solid #f3f4f6",
        borderRadius: "5px",
        padding: "10px 15px",
        boxShadow: "0.2px 0.2px 0.2px 0.2px #f3f4f6",
      }}
    >
      <span style={{ marginBottom: "10px" }}>
        Enter a collection/manifest Url
      </span>
      <div>
        <InputText
          className="t-border-solid t-border-gray-200 t-border-[1.5px] t-w-[200px] t-h-[30px] t-mb-[10px]"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <span>Or choose:</span>
      <TreeView />
    </OverlayPanel>
  );
};

export default NewPanelModal;
