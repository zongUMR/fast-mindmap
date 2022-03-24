import { Diagram } from "gojs";
import { LAYOUT_ANGLE_ENUM, LAYOUT_SORTING_ENUM } from "@/constants";

export type layoutOptions = {
    alignment: string;
    angle: LAYOUT_ANGLE_ENUM;
    sorting: LAYOUT_SORTING_ENUM;
};

export type LayoutControlerProps = {
    updateDiagram: (fn: (d: Diagram) => void) => void;
};

export type MapControlerProps = {} & LayoutControlerProps;
