import { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import { DownOutlined, UpOutlined, EditOutlined } from '@ant-design/icons';
import { Input } from 'antd';

import { FlowNodeProps } from '@/types';
import { AgentNodeData } from '@/types';
import { useFlowStore } from '@/store/flowStore';

const AgentNode = ({ id, data, selected }: FlowNodeProps) => {
  const agentData = data as AgentNodeData;
  const { updateNodeData } = useFlowStore();
  const [expanded, setExpanded] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState(agentData.name);
  const inputRef = useRef<any>(null); // 使用 any 类型绕过类型检查

  const toggleExpand = (e: React.MouseEvent) => {
    if (isEditingName) return; // 编辑状态下不折叠
    e.stopPropagation(); 
    setExpanded(!expanded);
  };
  
  const handleDoubleClick = () => {
    setEditingName(agentData.name); // 开始编辑时，同步为当前节点名称
    setIsEditingName(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingName(e.target.value);
  };

  const saveName = () => {
    if (editingName.trim() !== '' && editingName !== agentData.name) {
      updateNodeData(id, { name: editingName.trim() });
    }
    setIsEditingName(false);
  };

  const handleInputBlur = () => {
    saveName();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveName();
    }
    if (e.key === 'Escape') {
      setEditingName(agentData.name); // 取消编辑，恢复原名称
      setIsEditingName(false);
    }
  };
  
  // 自动聚焦到输入框
  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);
  
  return (
    <>
      <NodeResizer 
        minWidth={180}
        minHeight={expanded ? 100 : 40}
        isVisible={selected} 
      />
      <div className={`group agent-node border rounded-lg shadow-md bg-gradient-to-b from-white to-slate-50 hover:shadow-lg transition-shadow ${selected ? 'border-agent' : 'border-agent/30'}`}>
        <div 
          className="agent-node-header bg-gradient-to-r from-agent/10 to-agent/5 p-2 rounded-t text-agent font-medium flex justify-between items-center cursor-pointer"
          onClick={toggleExpand}
          onDoubleClick={handleDoubleClick}
        >
          <div className="truncate flex-1 flex items-center">
            {isEditingName ? (
              <Input
                ref={inputRef}
                value={editingName}
                onChange={handleNameChange}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                size="small"
                className="nodrag nopan flex-1"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <> 
                <span className="truncate">{agentData.label || '代理'} - {agentData.name}</span>
                <EditOutlined 
                  className="ml-2 text-xs text-agent/50 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" 
                  onClick={(e) => {
                    e.stopPropagation(); // 防止触发折叠
                    handleDoubleClick(); // 点击图标也进入编辑模式
                  }}
                />
              </>
            )}
          </div>
          <div className="flex-shrink-0 ml-2">
            {expanded ? (
              <UpOutlined className="text-xs text-agent/70" />
            ) : (
              <DownOutlined className="text-xs text-agent/70" />
            )}
          </div>
        </div>
        
        {expanded && (
          <div className="p-2 text-xs text-gray-600">
            <div className="mb-1 truncate max-w-full" title={agentData.instructions}>
              指令: {agentData.instructions.substring(0, 50)}{agentData.instructions.length > 50 ? '...' : ''}
            </div>
            {agentData.handoff_description && (
              <div className="mb-1 truncate" title={agentData.handoff_description}>
                转交描述: {agentData.handoff_description.substring(0, 30)}{agentData.handoff_description.length > 30 ? '...' : ''}
              </div>
            )}
            {agentData.handoffs?.length > 0 && (
              <div className="mb-1">
                可转交: <span className="text-agent font-medium">{agentData.handoffs.length}</span>
              </div>
            )}
            {agentData.tools?.length > 0 && (
              <div className="mb-1">
                工具: <span className="text-functionTool font-medium">{agentData.tools.length}</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* 连接点 */}
      <Handle
        type="target"
        position={Position.Top}
      />
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </>
  );
};

export default memo(AgentNode);
