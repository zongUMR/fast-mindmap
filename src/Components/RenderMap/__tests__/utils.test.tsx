import { NodeType } from "@/app.d";
import { MapType } from "../index.d";
import { transformData, convertMapToNode } from "../utils";
import { inputData, mapData } from "./helper";

describe("Test RenderMap utils", () => {
    test("Transform input data to map data", () => {
        const result: MapType[] = [];
        transformData(inputData, result);
        expect(result[0].key).toBe("1");
        expect(result[1].parent).toBe("1");
        expect(result.length).toBe(3);
    });

    test("Convert Map data to Input data", () => {
        const inputData: NodeType[] = [];

        convertMapToNode(mapData, inputData, true);
        expect(inputData[0].key).toBe("1");
        expect(inputData[0].children.length).toBe(2);
        expect(inputData[0].children[0].parent).toBe("1");
    });
});
