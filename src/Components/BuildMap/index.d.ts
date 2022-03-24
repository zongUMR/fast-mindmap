import {
    BasicNodeType,
    NodeType,
    AddChildActionType,
    DeleteNodeActionType,
    EditNodeActionType,
} from "@/app.d";

export type BuildMapProps = {
    mapData: NodeType[];
    addChildAction: AddChildActionType;
    deleteNodeAction: DeleteNodeActionType;
    editNodeAction: EditNodeActionType;
    changePath: number[];
};

export type AddChildProps = {
    changePath: number[];
    addChildAction: AddChildActionType;
};

export type EditNodeProps = {
    changePath: number[];
    editNodeAction: EditNodeActionType;
    node: BasicNodeType;
};

export type DeleteNodeProps = {
    changePath: number[];
    deleteNodeAction: DeleteNodeActionType;
};
