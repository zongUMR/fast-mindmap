import { v4 as uuidv4 } from "uuid";
import { useCallback, useState } from "react";
import { fromJS } from "immutable";
import { Input, Button } from "antd";

import RenderMap from "./Components/RenderMap";
import BuildMap from "./Components/BuildMap";
import {
  NodeType,
  AddChildActionType,
  DeleteNodeActionType,
  EditNodeActionType,
} from "./app.d";

import "./App.css";

function App() {
  const [data, setData] = useState<NodeType[]>([
    {
      key: "1",
      brush: "red",
      text: "test1",
      isRoot: true,
      children: [
        {
          key: "2",
          parent: "1",
          text: "test2",
          brush: "green",
          children: [],
        },
        {
          key: "3",
          parent: "1",
          text: "test3",
          brush: "black",
          children: [],
        },
      ],
    },
  ]);
  const [rootValue, setRootValue] = useState("");

  const addChildAction: AddChildActionType = useCallback(
    (changePath, payload) => {
      const dataAccessPath = changePath.reduce(
        (prev: (string | number)[], curr: number) => {
          return [...prev, curr, "children"];
        },
        []
      );

      const key = uuidv4();
      setData((data) =>
        fromJS(data)
          // @ts-ignore
          .updateIn(dataAccessPath, (list) =>
            list.push({
              ...payload,
              key,
              children: [],
            })
          )
          .toJS()
      );
    },
    []
  );

  const deleteNodeAction: DeleteNodeActionType = useCallback((changePath) => {
    if (changePath.length === 1) {
      // @ts-ignore
      setData((data) => fromJS(data).deleteIn(changePath).toJS());
    } else {
      const dataAccessPath = changePath.reduce(
        (prev: (string | number)[], curr: number) => {
          return [...prev, curr, "children"];
        },
        []
      );

      const prefixPath = dataAccessPath.slice(0, -1);
      // @ts-ignore
      setData((data) => fromJS(data).deleteIn(prefixPath).toJS());
    }
  }, []);

  const editNodeAction: EditNodeActionType = useCallback(
    (changePath, newPayload) => {
      const dataAccessPath = changePath.reduce(
        (prev: (string | number)[], curr: number) => {
          return [...prev, curr, "children"];
        },
        []
      );
      const prefixPath = dataAccessPath.slice(0, -1);

      setData((data) =>
        fromJS(data)
          // @ts-ignore
          .updateIn(prefixPath, (obj) => {
            return {
              ...obj.toJS(),
              ...newPayload,
            };
          })
          .toJS()
      );
    },
    []
  );

  const addRootNode = useCallback(() => {
    const key = uuidv4();
    setData((d) => [
      ...d,
      {
        text: rootValue,
        isRoot: true,
        key,
        brush: "black",
        children: [],
      },
    ]);
    setRootValue("");
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
              onChange={(e) => setRootValue(e.target.value)}
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
        <RenderMap data={data} setData={setData} />
      </div>
    </div>
  );
}

export default App;
