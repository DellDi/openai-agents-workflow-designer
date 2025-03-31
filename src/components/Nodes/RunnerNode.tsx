import { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import { DownOutlined, UpOutlined, RocketOutlined } from '@ant-design/icons';

import { FlowNodeProps, RunnerNodeData } from '@/types';

const RunnerNode = ({ data, selected }: FlowNodeProps) => {
  const runnerData = data as RunnerNodeData;
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
      <div className="runner-node border rounded-lg shadow-md bg-gradient-to-b from-white to-slate-50 hover:shadow-lg transition-shadow border-runner/30">
        <div 
          className="runner-node-header bg-gradient-to-r from-runner/10 to-runner/5 p-2 rounded-t text-runner font-medium flex justify-between items-center cursor-pointer"
          onClick={toggleExpand}
        >
          <div className="truncate flex-1 flex items-center">
            <RocketOutlined className="mr-1" /> {runnerData.label || '执行器'}
          </div>
          <div className="flex-shrink-0 ml-2">
            {expanded ? (
              <UpOutlined className="text-xs text-runner/70" />
            ) : (
              <DownOutlined className="text-xs text-runner/70" />
            )}
          </div>
        </div>
        
        {expanded && (
          <div className="p-2 text-xs text-gray-600">
            <div className="mb-1 truncate max-w-full" title={runnerData.input}>
              输入: {runnerData.input.substring(0, 50)}{runnerData.input.length > 50 ? '...' : ''}
            </div>
            <div className="mb-1">
              模式: <span className={runnerData.mode === 'async' ? 'text-runner font-medium' : 'text-blue-500 font-medium'}>
                {runnerData.mode === 'async' ? '异步' : '同步'}
              </span>
            </div>
            {runnerData.context && (
              <div className="mb-1 truncate" title={runnerData.context}>
                上下文: {runnerData.context.substring(0, 30)}{runnerData.context.length > 30 ? '...' : ''}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* 连接点 - 使用默认样式 */}
      <Handle
        type="target"
        position={Position.Top}
      />
    </>
  );
};

export default memo(RunnerNode);
