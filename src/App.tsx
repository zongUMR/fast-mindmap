import { v4 as uuidv4 } from 'uuid';
import { useCallback, useState } from 'react';
import { fromJS } from 'immutable';
import { Input, Button } from 'antd';

import RenderMap from './Components/RenderMap';
import BuildMap from './Components/BuildMap';
import {
  NodeType,
  AddChildActionType,
  DeleteNodeActionType,
  EditNodeActionType,
  LinkStrokeChange,
} from './app.d';

import './App.css';

function App() {
  const [data, setData] = useState<NodeType[]>([]);
  const [rootValue, setRootValue] = useState('');
  const [linkStrokeChange, setLinkStrokeChange] = useState<LinkStrokeChange>({
    nodeKey: null,
    brush: null,
  });

  /*
   * Add a new child node for certain node
   * @param{number[]} changePath - the index path for node to change
   * @param{NodeType} payload - the payload of new node child
   */
  const addChildAction: AddChildActionType = useCallback(
    (changePath, payload) => {
      // dataAccessPath: construct a index path for positon to insert
      const dataAccessPath = changePath.reduce(
        (prev: (string | number)[], curr: number) => {
          return [...prev, curr, 'children'];
        },
        [],
      );

      const key = uuidv4();
      setData(data =>
        fromJS(data)
          // @ts-ignore
          .updateIn(dataAccessPath, list =>
            list.push({
              ...payload,
              key,
              children: [],
            }),
          )
          .toJS(),
      );
    },
    [],
  );

  /*
   * Delete a node and its all children nodes
   * @param{number[]} changePath - The index path of node to delete
   */
  const deleteNodeAction: DeleteNodeActionType = useCallback(changePath => {
    // Delete the root node directly
    if (changePath.length === 1) {
      // @ts-ignore
      setData(data => fromJS(data).deleteIn(changePath).toJS());
    } else {
      const dataAccessPath = changePath.reduce(
        (prev: (string | number)[], curr: number) => {
          return [...prev, curr, 'children'];
        },
        [],
      );

      const prefixPath = dataAccessPath.slice(0, -1);
      // @ts-ignore
      setData(data => fromJS(data).deleteIn(prefixPath).toJS());
    }
  }, []);

  /*
   * Update the content for a certain node
   * @param{number[]} changePath - The index path for node to edit
   * @param{NodeType} newPayload - The new content for the node
   */
  const editNodeAction: EditNodeActionType = useCallback(
    (changePath, newPayload, strokeChanged, strokehChangePayload) => {
      const dataAccessPath = changePath.reduce(
        (prev: (string | number)[], curr: number) => {
          return [...prev, curr, 'children'];
        },
        [],
      );
      const prefixPath = dataAccessPath.slice(0, -1);

      if (strokeChanged) {
        setLinkStrokeChange(strokehChangePayload);
      }
      setData(data =>
        fromJS(data)
          // @ts-ignore
          .updateIn(prefixPath, obj => {
            return {
              ...obj.toJS(),
              ...newPayload,
            };
          })
          .toJS(),
      );
    },
    [],
  );

  // Add a new rootNode to data
  const addRootNode = useCallback(() => {
    const key = uuidv4();
    setData(d => [
      ...d,
      {
        text: rootValue,
        isRoot: true,
        key,
        brush: 'black',
        children: [],
      },
    ]);
    setRootValue('');
  }, [rootValue, setData]);

  return (
    <div className="App">
      <div className="content-input">
        <h2>内容编辑</h2>
        <div className="content-input-root">
          <Input.Group compact>
            <Input
              style={{ width: 300 }}
              value={rootValue}
              onChange={e => setRootValue(e.target.value)}
              onPressEnter={() => {
                addRootNode();
              }}
              placeholder="请输入根节点内容"
            />
            <Button type="primary" onClick={addRootNode}>
              确定
            </Button>
          </Input.Group>
        </div>
        <BuildMap
          mapData={data}
          addChildAction={addChildAction}
          deleteNodeAction={deleteNodeAction}
          editNodeAction={editNodeAction}
          changePath={[]}
        />
      </div>
      <div className="content-mindmap">
        <h2>内容渲染</h2>
        <RenderMap
          linkStrokeChange={linkStrokeChange}
          data={data}
          setData={setData}
        />
      </div>
    </div>
  );
}

export default App;
