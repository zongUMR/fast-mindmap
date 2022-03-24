import { FC } from "react";

import LayoutControler from "./LayoutControler";
import { MapControlerProps } from "./index.d";
import "./index.css";

const MapControler: FC<MapControlerProps> = ({ updateDiagram }) => {
  return (
    <div className="mapControler">
      <LayoutControler updateDiagram={updateDiagram} />
    </div>
  );
};

export default MapControler;
