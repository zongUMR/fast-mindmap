import LayoutControler from "../LayoutControler";
import { screen, render } from "@testing-library/react";

import "../../../matchMedia.mock";

const updateDiagram = () => {};

describe("Test LayoutControler", () => {
    test("basic test", () => {
        render(<LayoutControler updateDiagram={updateDiagram} />);

        expect(screen.getByText("角度")).not.toBeNull();
    });
});
