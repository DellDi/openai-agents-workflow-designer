import { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import { DownOutlined, UpOutlined, SafetyOutlined } from '@ant-design/icons';

import { FlowNodeProps, GuardrailNodeData } from '@/types';

const GuardrailNode = ({ data, selected }: FlowNodeProps) => {
  const guardrailData = data as GuardrailNodeData;
  const [expanded, setExpanded] = useState(true);
  
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setExpanded(!expanded);
  };
  
  return (
    <>
      <NodeResizer 
        minWidth={180}
        minHeight={expanded ? 100 : 40}
        isVisible={selected} 
      />
      <div className="guardrail-node border rounded-lg shadow-md bg-gradient-to-b from-white to-slate-50 hover:shadow-lg transition-shadow border-guardrail/30">
        <div 
          className="guardrail-node-header bg-gradient-to-r from-guardrail/10 to-guardrail/5 p-2 rounded-t text-guardrail font-medium flex justify-between items-center cursor-pointer"
          onClick={toggleExpand}
        >
          <div className="truncate flex-1 flex items-center">
            <SafetyOutlined className="mr-1" /> {guardrailData.label || '守护墙'} - {guardrailData.name}
          </div>
          <div className="flex-shrink-0 ml-2">
            {expanded ? (
              <UpOutlined className="text-xs text-guardrail/70" />
            ) : (
              <DownOutlined className="text-xs text-guardrail/70" />
            )}
          </div>
        </div>
        
        {expanded && (
          <div className="p-2 text-xs text-gray-600">
            {guardrailData.output_model && (
              <div className="mb-1">
                输出模型: <span className="text-guardrail font-medium">{guardrailData.output_model}</span>
              </div>
            )}
            {guardrailData.guardrail_function && (
              <div className="mb-1 truncate" title={guardrailData.guardrail_function}>
                守护函数: <span className="text-guardrail font-medium">{guardrailData.guardrail_function.substring(0, 40)}{guardrailData.guardrail_function.length > 40 ? '...' : ''}</span>
              </div>
            )}
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

export default memo(GuardrailNode);
