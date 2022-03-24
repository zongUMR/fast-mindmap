import { FC, useEffect, useMemo, useRef, useCallback } from 'react';
import { ReactDiagram } from 'gojs-react';
import { Diagram, Link } from 'gojs';

import { NodeType } from '@/app.d';
import { RenderMapProps, MapType, UpdateDataActionType } from './index.d';
import initDiagram from './initDiagram';
import { transformData, convertMapToNode } from './utils';
import MapControler from '../MapControler';

import './index.css';

const RenderMap: FC<RenderMapProps> = ({
  linkStrokeChange,
  setData,
  data = [],
}) => {
  const diagramRef = useRef<ReactDiagram | null>(null);

  /*
   * Transform data from NodeType[] to MapType[] when the source data changed, the digram component will only accept certain data fields
   */
  const diagramData = useMemo(() => {
    const res: MapType[] = [];
    transformData(data, res);
    return res;
  }, [data]);

  useEffect(() => {
    if (!diagramRef.current) return;
    if (linkStrokeChange.nodeKey && linkStrokeChange.brush) {
      const diagram = diagramRef.current.getDiagram();
      const node = diagram?.findNodeForKey(linkStrokeChange.nodeKey);
      const links = node?.findLinksInto();
      diagram?.commit(() => {
        links?.each((l: Link) => {
          if (l.path?.stroke) {
            l.path.stroke = linkStrokeChange.brush;
          }
        });
      });
    }
  }, [linkStrokeChange.brush, linkStrokeChange.nodeKey]);

  /*
   * Update the properties of the diagram to change the diagram content
   * @param{function} fn: The function to update diagram's properties
   */
  const updateDiagram = useCallback(
    fn => {
      if (!diagramRef.current) return;
      const diagram = diagramRef.current.getDiagram() as Diagram;
      const flag = 'change diagram';
      diagram.startTransaction(flag);
      fn(diagram);
      diagram.commitTransaction(flag);
    },
    [diagramRef],
  );

  /*
   * Update source data in edit panel
   * @param{MapType[]} diagramDataJson - diagram emit internal json data for editPanel
   */
  const updateData: UpdateDataActionType = useCallback(
    (diagramDataJson: MapType[]) => {
      const nodeData: NodeType[] = [];
      convertMapToNode(diagramDataJson, nodeData, true);
      setData(nodeData);
    },
    [setData],
  );

  return (
    <div className="contentRenderer">
      <MapControler updateDiagram={updateDiagram} />
      <h3>渲染结果</h3>
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
