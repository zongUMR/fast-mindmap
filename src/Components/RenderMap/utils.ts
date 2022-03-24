import { NodeType } from "@/app.d";
import { MapType } from "./index.d";

/*
 * Convert NodeType array to MapType array
 * @param{NodeType[]} data - array to store converted data
 * @param{MapType[]} res - the result array
 ***************
 * exmaple:
 * data = [{key: '1', isRoot: true, brush: 'black', children: [{ key: '2', isRoot: false, brush: 'red', children: []}] }]
 * res = []
 * transformData(data, res);
 * res => [{key: '1', isRoot: true, brush: 'black'}, { key: '2', parent: '1', isRoot: false, brush: 'red' }]
 */
export const transformData = (data: NodeType[], res: MapType[]) => {
  for (const item of data) {
    const { brush = "black", isRoot, children, key, text, pic } = item;
    if (isRoot) {
      res.push({
        key,
        text,
        brush,
        isRoot: true,
        pic,
      });
    }

    for (const child of children) {
      res.push({
        parent: key,
        key: child.key,
        text: child.text,
        brush: child.brush,
        isRoot: false,
        pic: child.pic,
      });
    }

    transformData(children, res);
  }
};

/*
 * Convert MapType array to NodeType array
 * @param{MapType[]} data - diagram data to convert
 * @param{NodeType} res - array to store converted data
 * @param{boolean} init - should init the root Nodes
 *******
 * example
 * data = [{key: '1', isRoot: true, brush: 'black'}, { key: '2', parent: '1', isRoot: false, brush: 'red' }]
 * res = []
 * convertMapToNode(data, res, true);
 * res => [{key: '1', isRoot: true, brush: 'black', children: [{ key: '2', isRoot: false, brush: 'red', children: []}] }]
 */
export const convertMapToNode = (
  data: MapType[],
  res: NodeType[],
  init: boolean = false
) => {
  if (data.length === 0) return;

  const tempData: MapType[] = [];
  if (init) {
    for (const item of data) {
      if (item.isRoot) {
        res.push({
          ...item,
          children: [],
        });
      } else {
        tempData.push(item);
      }
    }
    convertMapToNode(tempData, res);
  } else {
    const tempRes: NodeType[] = [];
    for (const item of data) {
      const target = res.find((i) => i.key === item.parent);
      if (target) {
        const newItem = { ...item, children: [] };
        target.children.push(newItem);
        tempRes.push(newItem);
      } else {
        tempData.push(item);
      }
    }
    convertMapToNode(tempData, tempRes);
  }
};
