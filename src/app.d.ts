export type BasicNodeType = {
    brush: string;
    text: string;
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
    payload: BasicNodeType
) => void;
