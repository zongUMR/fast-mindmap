import { NodeType } from "@/app.d";
import { MapType } from "../index.d";

export const inputData: NodeType[] = [
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
];
export const mapData: MapType[] = [
    { key: "1", text: "test1", brush: "red", isRoot: true },
    {
        parent: "1",
        key: "2",
        text: "test2",
        brush: "green",
        isRoot: false,
    },
    {
        parent: "1",
        key: "3",
        text: "test3",
        brush: "black",
        isRoot: false,
    },
];
