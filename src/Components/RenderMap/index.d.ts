import { NodeType, LinkStrokeChange } from "@/app.d";

export type setDataActionType = (data: NodeType[]) => void;

export type RenderMapProps = {
    data: NodeType[];
    setData: setDataActionType;
    linkStrokeChange: LinkStrokeChange
};

export type MapType = {
    parent?: string;
    key: string;
    brush: string;
    isRoot?: boolean;
    text: string;
    pic?: string;
};

export type UpdateDataActionType = (data: MapType[]) => void;
