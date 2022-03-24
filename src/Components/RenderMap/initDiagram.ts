import { v4 as uuidv4 } from "uuid";
import * as go from "gojs";
import { UpdateDataActionType } from "./index.d";

const addNodeAndLink = (_e: go.InputEvent, obj: go.GraphObject) => {
  const adorn = obj.part;
  const diagram = adorn?.diagram;
  diagram!.startTransaction("Add Node");
  // @ts-ignore
  const oldnode = adorn!.adornedPart;
  const olddata = oldnode.data;
  // copy the brush and direction to the new node data
  const newdata = {
    text: "idea",
    brush: olddata.brush,
    parent: olddata.key,
    key: uuidv4(),
  };
  diagram!.model.addNodeData(newdata);
  diagram!.commitTransaction("Add Node");

  // if the new node is off-screen, scroll the diagram to show the new node
  const newnode = diagram?.findNodeForData(newdata);
  if (newnode !== null) diagram?.scrollToRect(newnode!.actualBounds);
};

const addNodeTemplate = (diagram: go.Diagram) => {
  const $ = go.GraphObject.make;

  const node = new go.Node("Vertical", {
    selectionObjectName: "TEXT",
  });

  const textBlock = new go.TextBlock({
    name: "TEXT",
    minSize: new go.Size(30, 15),
    editable: true,
  });
  textBlock.bind(new go.Binding("text", "text").makeTwoWay());
  node.add(textBlock);

  const shape = new go.Shape("LineH", {
    stretch: go.GraphObject.Horizontal,
    strokeWidth: 3,
    height: 3,
    // this line shape is the port -- what links connect with
    portId: "",
    fromSpot: go.Spot.LeftRightSides,
    toSpot: go.Spot.LeftRightSides,
  }).bind(new go.Binding("stroke", "brush"));
  node.add(shape);

  const pic = new go.Picture({
    name: "PIC",
    margin: 8,
    width: 60,
    height: 60,
    click: (_e, obj: go.GraphObject) => {
      let newTab = window.open() as Window;
      // @ts-ignore
      const base64Url = obj?.panel?.findObject("PIC")?.source;
      newTab.document.body.innerHTML = `<img  src=${base64Url} width="600px" height="600px" />`;
    },
  }).bind(
    new go.Binding("source", "pic", (e) => {
      return e;
    })
  );

  node.add(pic);
  diagram.nodeTemplate = node;

  // Add button for exntending a children node in graph
  diagram.nodeTemplate.selectionAdornmentTemplate = $(
    go.Adornment,
    "Spot",
    $(
      go.Panel,
      "Auto",
      // this Adornment has a rectangular blue Shape around the selected node
      $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 3 }),
      $(go.Placeholder, { margin: new go.Margin(4, 4, 0, 4) })
    ),
    // and this Adornment has a Button to the right of the selected node
    $(
      "Button",
      {
        name: "diagramAddButton",
        alignment: go.Spot.Right,
        alignmentFocus: go.Spot.Left,
        click: addNodeAndLink, // define click behavior for this Button in the Adornment
      },
      $(
        go.TextBlock,
        "+", // the Button content
        { font: "bold 8pt sans-serif" }
      )
    )
  );
};

const addLinkTemplate = (diagram: go.Diagram) => {
  const link = new go.Link({
    curve: go.Link.Bezier,
    fromShortLength: -2,
    toShortLength: -2,
    selectable: false,
  });

  const shape = new go.Shape({
    strokeWidth: 3,
  }).bind(
    new go.Binding("stroke", "toNode", (n) => {
      if (n.data.brush) return n.data.brush;
      return "black";
    }).ofObject()
  );

  link.add(shape);
  diagram.linkTemplate = link;
};

const addContextMenu = (
  diagram: go.Diagram,
  updateData: UpdateDataActionType
) => {
  const $ = go.GraphObject.make;

  diagram.contextMenu = $(
    "ContextMenu",
    $("ContextMenuButton", $(go.TextBlock, "保存图片"), {
      click: (e) => {
        const currentDiagram = e.diagram;
        currentDiagram.makeImageData({
          background: "white",
          returnType: "blob",
          callback: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const name = "download.png";
            const aTag = document.createElement("a");
            aTag.style.display = "none";
            aTag.href = url;
            aTag.download = name;

            document.body.appendChild(aTag);
            requestAnimationFrame(() => {
              aTag.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(aTag);
            });
          },
        });
      },
    }),
    $("ContextMenuButton", $(go.TextBlock, "保存数据 "), {
      click: (e) => {
        const data = e.diagram.model.toJson();
        const { nodeDataArray } = JSON.parse(data);
        updateData(nodeDataArray);
      },
    })
  );
};

const addNodeContextMenu = (diagram: go.Diagram) => {
  const changeTextSize = (obj: go.GraphObject, size: number) => {
    const adorn = obj.part;
    adorn!.diagram!.startTransaction("Change Text Size");
    // @ts-ignore
    var node = adorn!.adornedPart;
    var tb = node.findObject("TEXT");
    tb.scale *= size;
    adorn!.diagram!.commitTransaction("Change Text Size");
  };

  const toggleTextWeight = (obj: go.GraphObject) => {
    const adorn = obj.part;
    adorn!.diagram!.startTransaction("Change Text Weight");
    // @ts-ignore
    const node = adorn!.adornedPart;
    const tb = node.findObject("TEXT");
    // assume "bold" is at the start of the font specifier
    const idx = tb.font.indexOf("bold");
    if (idx < 0) {
      tb.font = "bold " + tb.font;
    } else {
      tb.font = tb.font.substr(idx + 5);
    }
    adorn!.diagram!.commitTransaction("Change Text Weight");
  };

  const $ = go.GraphObject.make;

  diagram.nodeTemplate.contextMenu = $(
    "ContextMenu",
    $("ContextMenuButton", $(go.TextBlock, "字体增加"), {
      click: (_e, obj) => changeTextSize(obj, 1.1),
    }),
    $("ContextMenuButton", $(go.TextBlock, "字体减小"), {
      click: (_e, obj) => changeTextSize(obj, 1 / 1.1),
    }),
    $("ContextMenuButton", $(go.TextBlock, "加粗/正常"), {
      click: (_e, obj) => toggleTextWeight(obj),
    }),
    $("ContextMenuButton", $(go.TextBlock, "删除"), {
      click: (e) => e.diagram.commandHandler.deleteSelection(),
    }),
    $("ContextMenuButton", $(go.TextBlock, "Undo"), {
      click: (e) => e.diagram.commandHandler.undo(),
    }),
    $("ContextMenuButton", $(go.TextBlock, "Redo"), {
      click: (e) => e.diagram.commandHandler.redo(),
    })
  );
};

export default (updateData: UpdateDataActionType): go.Diagram => {
  const myDiagram = new go.Diagram({
    "commandHandler.copiesTree": true,
    "commandHandler.copiesParentKey": true,
    "commandHandler.deletesTree": true,
    "draggingTool.dragsTree": true,
    "undoManager.isEnabled": true,
    initialPosition: go.Point.parse("-10 -200"), // put the root node at the top-left position but don't overflow the watermark
    model: new go.TreeModel(),
    layout: new go.TreeLayout(),
  });

  addNodeTemplate(myDiagram);
  addLinkTemplate(myDiagram);
  addContextMenu(myDiagram, updateData);
  addNodeContextMenu(myDiagram);

  return myDiagram;
};
