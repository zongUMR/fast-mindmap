import { FC } from 'react';
import AddChild from './AddChild';
import DeleteNode from './DeleteNode';
import EditNode from './EditNode';

import { BuildMapProps } from './index.d';
import './index.css';

const BuildMap: FC<BuildMapProps> = ({
  mapData,
  addChildAction,
  deleteNodeAction,
  editNodeAction,
  changePath,
}) => {
  return (
    <div className="buildMap">
      {mapData.map(({ key, text, children, brush }, index) => {
        const newChangePath = [...changePath, index];
        return (
          <div key={key + text + brush} className="buildMapItem">
            <span className="buildMapItem-content">{text}</span>
            <AddChild
              changePath={newChangePath}
              addChildAction={addChildAction}
            />
            <EditNode
              changePath={newChangePath}
              editNodeAction={editNodeAction}
              node={{ text, brush, key }}
            />
            <DeleteNode
              changePath={newChangePath}
              deleteNodeAction={deleteNodeAction}
            />
            {children.length > 0 && (
              <BuildMap
                mapData={children}
                addChildAction={addChildAction}
                changePath={newChangePath}
                editNodeAction={editNodeAction}
                deleteNodeAction={deleteNodeAction}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BuildMap;
