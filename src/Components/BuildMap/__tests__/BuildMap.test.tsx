import "../../../matchMedia.mock";

import { cleanup, render, screen } from "@testing-library/react";
import { Simulate } from "react-dom/test-utils";
import BuildMap from "../index";
import { inputData } from "../../RenderMap/__tests__/helper";
import { BasicNodeType } from "@/app.d";

describe("Test BuildMap", () => {
    let container: HTMLElement;
    let changePath: number[] = [];
    let nodeData: BasicNodeType = {
        brush: "",
        text: "",
    };

    const deleteNodeAction = (path: number[]) => {
        changePath = path;
    };
    const addChildAction = (path: number[], payload: BasicNodeType) => {
        path = path;
        nodeData = payload;
    };

    const editNodeAction = (path: number[], payload: BasicNodeType) => {
        console.log(path, payload);
    };
    beforeEach(() => {
        container = render(
            <BuildMap
                editNodeAction={editNodeAction}
                mapData={inputData}
                changePath={[]}
                addChildAction={addChildAction}
                deleteNodeAction={deleteNodeAction}
            />
        ).container;
    });

    afterEach(() => cleanup());

    test("basic render", () => {
        expect(screen.getByText(inputData[0].text)).not.toBeNull();
        expect(document.getElementsByClassName("buildMapItem").length).toBe(3);
    });

    test("delete node", () => {
        const deleteButton = container.getElementsByClassName(
            "deleteNode"
        )[1] as HTMLButtonElement;
        deleteButton.click();

        const confirmDelete = document.getElementsByClassName(
            "ant-btn-primary"
        )[0] as HTMLButtonElement;
        confirmDelete.click();

        expect(changePath[0]).toBe(0);
        expect(changePath[1]).toBe(0);
    });

    test("add node", () => {
        const addButton = container.getElementsByClassName(
            "addChild"
        )[1] as HTMLButtonElement;
        addButton.click();

        const inputEle = screen.getByPlaceholderText(
            "输入内容"
        ) as HTMLInputElement;
        inputEle.value = "newNode";
        Simulate.change(inputEle);

        const submitButton = document.getElementsByClassName(
            "ant-btn-primary"
        )[0] as HTMLButtonElement;
        submitButton.click();

        expect(nodeData.text).toBe("newNode");
    });
});
