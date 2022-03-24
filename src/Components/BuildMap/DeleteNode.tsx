import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { FC } from "react";

import { DeleteNodeProps } from "./index.d";

const DeleteNode: FC<DeleteNodeProps> = ({ changePath, deleteNodeAction }) => {
  return (
    <Popconfirm
      okText="删除"
      cancelText="取消"
      icon={null}
      title="确定删除此节点以及所有子节点?"
      onConfirm={() => deleteNodeAction(changePath)}
    >
      <Button size="small" className="deleteNode" icon={<DeleteOutlined />} />
    </Popconfirm>
  );
};

export default DeleteNode;
