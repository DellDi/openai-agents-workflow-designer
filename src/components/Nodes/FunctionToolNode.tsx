import { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import { DownOutlined, UpOutlined, ToolOutlined } from '@ant-design/icons';

import { FlowNodeProps, FunctionToolNodeData } from '@/types';

const FunctionToolNode = ({ data, selected }: FlowNodeProps) => {
  const functionData = data as FunctionToolNodeData;
  const [expanded, setExpanded] = useState(true);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止事件冒泡触发节点选择
    setExpanded(!expanded);
  };

  return (
    <>
      <NodeResizer
        minWidth={180}
        minHeight={expanded ? 100 : 40}
        isVisible={selected}
      />
      <div className="function-tool-node border rounded-lg shadow-md bg-gradient-to-b from-white to-slate-50 hover:shadow-lg transition-shadow border-functionTool/30">
        <div
          className="function-tool-node-header bg-gradient-to-r from-functionTool/10 to-functionTool/5 p-2 rounded-t text-functionTool font-medium flex justify-between items-center cursor-pointer"
          onClick={toggleExpand}
        >
          <div className="truncate flex-1 flex items-center">
            <ToolOutlined className="mr-1" /> {functionData.label || '函数工具'} - {functionData.name}
          </div>
          <div className="flex-shrink-0 ml-2">
            {expanded ? (
              <UpOutlined className="text-xs text-functionTool/70" />
            ) : (
              <DownOutlined className="text-xs text-functionTool/70" />
            )}
          </div>
        </div>

        {expanded && (
          <div className="p-2 text-xs text-gray-600">
            <div className="mb-1">
              参数: <span className="text-functionTool font-medium">{functionData.parameters.map(p => p.name).join(', ') || '无'}</span>
            </div>
            <div className="mb-1">
              返回类型: <span className="text-functionTool font-medium">{functionData.returnType}</span>
            </div>
            <div className="mb-1 truncate max-w-full" title={functionData.implementation}>
              实现: {functionData.implementation.substring(0, 40)}{functionData.implementation.length > 40 ? '...' : ''}
            </div>
          </div>
        )}
      </div>

      {/* 连接点 - 使用默认样式 */}
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </>
  );
};

export default memo(FunctionToolNode);
