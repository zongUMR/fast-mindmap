import { FC, memo, useState, useCallback } from 'react';
import { Popconfirm, Input, Button, Upload, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { GithubPicker } from 'react-color';

import { EditNodeProps } from './index.d';

const EditNode: FC<EditNodeProps> = ({ changePath, editNodeAction, node }) => {
  const [text, setText] = useState(node.text);
  const [brush, setBrush] = useState(node.brush);
  const [imageUrl, setImageUrl] = useState(node.pic);

  // Convert the image you uploaded to base64 string, because we don't upload it to a server actually
  const getBase64 = useCallback(img => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.addEventListener('load', () => {
      setImageUrl(reader.result as string);
      message.info('设置成功');
    });
    reader.addEventListener('error', () => {
      message.error('设置失败');
    });
  }, []);

  return (
    <Popconfirm
      okText="编辑"
      icon={null}
      cancelText="取消"
      title={
        <>
          <Upload
            showUploadList={false}
            beforeUpload={file => {
              const validType =
                file.type === 'image/jpeg' || file.type === 'image/png';
              if (!validType) {
                message.error('只能使用 png/jpeg 类型的图片');
              }
              const isLt2M = file.size / 1024 / 1024 < 2;
              if (!isLt2M) {
                message.error('图片必须小于2M');
              }
              return validType && isLt2M;
            }}
            onChange={info => {
              if (info.file.status !== 'uploading') {
                getBase64(info.file.originFileObj);
              }
            }}
          >
            <Button>修改图片</Button>
          </Upload>
          <Input
            style={{ marginBottom: 10, marginTop: 10 }}
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <GithubPicker color={brush} onChange={c => setBrush(c.hex)} />
        </>
      }
      onConfirm={() => {
        editNodeAction(
          changePath,
          {
            text,
            brush,
            pic: imageUrl,
            key: node.key,
          },
          brush !== node.brush,
          { nodeKey: node.key, brush },
        );
      }}
    >
      <Button size="small" className="editNode" icon={<EditOutlined />} />
    </Popconfirm>
  );
};

export default memo(EditNode);
