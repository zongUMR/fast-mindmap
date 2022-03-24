export type BasicNodeType = {
    brush: string;
    text: string;
    key: string;
    pic?: string;
};

export type NodeType = {
    key: string;
    children: NodeType[];
    parent?: string;
    isRoot?: boolean;
} & BasicNodeType;

export type AddChildActionType = (
    path: number[],
    payload: BasicNodeType
) => void;

export type DeleteNodeActionType = (path: number[]) => void;
export type EditNodeActionType = (
    path: number[],
    payload: BasicNodeType,
    strokeChanged: boolean,
    strokeChangePayload: { brush: string, nodeKey: string }
) => void;

export type LinkStrokeChange = {
    nodeKey: string | null;
    brush: string | null;
}
