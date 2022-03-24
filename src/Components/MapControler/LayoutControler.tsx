import React from "react";
import { TreeLayout, Diagram, EnumValue } from "gojs";
import { Form, Select, Button } from "antd";
import {
  LAYOUT_ANGLE,
  LAYOUT_ALIGNMENT,
  LAYOUT_SORTING,
  INIT_LAYOUT_OPTIONS,
} from "@/constants";
import { useEffect, useState } from "react";

import { LayoutControlerProps, layoutOptions } from "./index.d";
import "./LayoutControler.css";

const LayoutControler: React.FC<LayoutControlerProps> = ({
  updateDiagram,
}: LayoutControlerProps) => {
  const [layoutOptions, setLayoutOptions] =
    useState<layoutOptions>(INIT_LAYOUT_OPTIONS);
  const [form] = Form.useForm();

  /*
   * When the options changed, affect and rerender the diagram content
   */
  useEffect(() => {
    const update = (diagram: Diagram) => {
      const layout = diagram.layout as TreeLayout;
      layout.angle = layoutOptions.angle;
      layout.alignment = TreeLayout[
        layoutOptions.alignment as keyof typeof TreeLayout
      ] as EnumValue;
      layout.sorting = TreeLayout[
        layoutOptions.sorting as keyof typeof TreeLayout
      ] as EnumValue;
    };

    updateDiagram(update);
  }, [layoutOptions, updateDiagram]);

  return (
    <div className="layoutControler">
      <h3>布局控制</h3>
      <Form
        form={form}
        name="layoutControler"
        layout="inline"
        onFinish={setLayoutOptions}
        initialValues={layoutOptions}
      >
        <Form.Item name="angle" label="角度">
          <Select style={{ width: 100 }}>
            {LAYOUT_ANGLE.map((item) => (
              <Select.Option key={item.label} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="alignment" label="对齐方式">
          <Select style={{ width: 200 }}>
            {LAYOUT_ALIGNMENT.map((item) => (
              <Select.Option key={item.label} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="sorting" label="排序方式">
          <Select style={{ width: 200 }}>
            {LAYOUT_SORTING.map((item) => (
              <Select.Option key={item.label} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => (
            <Button type="primary" size="middle" htmlType="submit">
              提交
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default LayoutControler;
