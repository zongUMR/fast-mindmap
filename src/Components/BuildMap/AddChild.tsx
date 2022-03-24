import { FC, useCallback, useState } from "react";
import { Popconfirm, Input, Button, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { GithubPicker } from "react-color";

import { AddChildProps } from "./index.d";

const AddChild: FC<AddChildProps> = ({ changePath, addChildAction }) => {
  const [text, setText] = useState("");
  const [brush, setBrush] = useState("black");
  const [imageUrl, setImageUrl] = useState("");

  const getBase64 = useCallback((img) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.addEventListener("load", () => {
      setImageUrl(reader.result as string);
      message.info("设置成功");
    });
    reader.addEventListener("error", () => {
      message.error("设置失败");
    });
  }, []);

  return (
    <Popconfirm
      okText="添加"
      icon={null}
      cancelText="取消"
      title={
        <>
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              const validType =
                file.type === "image/jpeg" || file.type === "image/png";
              if (!validType) {
                message.error("只能使用 png/jpeg 类型的图片");
              }
              const isLt2M = file.size / 1024 / 1024 < 2;
              if (!isLt2M) {
                message.error("图片必须小于2M");
              }
              return validType && isLt2M;
            }}
            onChange={(info) => {
              if (info.file.status !== "uploading") {
                getBase64(info.file.originFileObj);
              }
            }}
          >
            <Button>上传图片</Button>
          </Upload>
          <Input
            placeholder="输入内容"
            style={{ marginBottom: 10, marginTop: 10 }}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <GithubPicker onChange={(c) => setBrush(c.hex)} />
        </>
      }
      onConfirm={() => {
        addChildAction(changePath, {
          text,
          brush,
          pic: imageUrl,
        });
        setText("");
        setImageUrl("");
        setBrush("black");
      }}
      onCancel={() => {
        setText("");
        setBrush("black");
      }}
    >
      <Button size="small" className="addChild" icon={<PlusOutlined />} />
    </Popconfirm>
  );
};

export default AddChild;
