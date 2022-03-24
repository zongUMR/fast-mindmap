import React, { FC, useMemo, useRef, useCallback } from "react";
import { ReactDiagram } from "gojs-react";
import { Diagram } from "gojs";

import { NodeType } from "@/app.d";
import { RenderMapProps, MapType, UpdateDataActionType } from "./index.d";
import initDiagram from "./initDiagram";
import { transformData, convertMapToNode } from "./utils";
import MapControler from "../MapControler";

import "./index.css";

const RenderMap: FC<RenderMapProps> = ({ setData, data = [] }) => {
  const diagramRef = useRef<ReactDiagram | null>(null);

  const diagramData = useMemo(() => {
    const res: MapType[] = [];
    transformData(data, res);
    return res;
  }, [data]);

  const updateDiagram = useCallback(
    (fn) => {
      if (!diagramRef.current) return;
      const diagram = diagramRef.current.getDiagram() as Diagram;
      const flag = "change diagram";
      diagram.startTransaction(flag);
      fn(diagram);
      diagram.commitTransaction(flag);
    },
    [diagramRef]
  );

  const updateData: UpdateDataActionType = useCallback(
    (diagramDataJson: MapType[]) => {
      const nodeData: NodeType[] = [];
      convertMapToNode(diagramDataJson, nodeData, true);
      setData(nodeData);
    },
    [setData]
  );

  return (
    <div className="contentRenderer">
      <MapControler updateDiagram={updateDiagram} />
      <ReactDiagram
        ref={diagramRef}
        divClassName="diagram-component"
        initDiagram={() => initDiagram(updateData)}
        nodeDataArray={diagramData}
      />
    </div>
  );
};

export default RenderMap;