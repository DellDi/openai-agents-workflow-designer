import { useState } from 'react';
import ReactFlow, { 
  Controls, 
  Background, 
  MiniMap, 
  ConnectionLineType, 
  ConnectionMode,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Switch, Tooltip, Badge } from 'antd';
import { SafetyOutlined, LinkOutlined } from '@ant-design/icons';

import { useFlowStore } from '@/store/flowStore';
import { nodeTypes } from '@/components/Nodes';
import { edgeTypes } from '@/components/Edges';
import CodeModal from '../Modals/CodeModal';

const Canvas = () => {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    onNodeClick,
    connectionValidationMode, 
    toggleConnectionValidation,
    setReactFlowInstance,
    isDragging
  } = useFlowStore();

  // 代码生成弹窗状态管理
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  return (
    <div className="flex-1 h-full relative">
      {/* 拖拽提示遮罩 */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-100/20 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <div className="text-lg font-medium text-blue-600 mb-2">释放鼠标添加节点</div>
            <div className="text-sm text-gray-500">拖动到合适位置后释放鼠标添加新节点</div>
          </div>
        </div>
      )}
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        connectionLineType={ConnectionLineType.Bezier}
        connectionLineStyle={{ stroke: '#94a3b8', strokeWidth: 2 }} 
        connectionMode={ConnectionMode.Strict}
        defaultEdgeOptions={{ 
          type: 'default',
          animated: true,
          style: { 
            strokeWidth: 2,
            stroke: '#94a3b8'  
          }
        }}
        onInit={(instance) => setReactFlowInstance(instance)}
      >
        <Controls />
        <MiniMap 
          nodeStrokeColor={(n) => {
            switch (n.type) {
              case 'agent': return '#818cf8';
              case 'functionTool': return '#fb923c';
              case 'runner': return '#4ade80';
              case 'guardrail': return '#f87171';
              default: return '#ccc';
            }
          }}
          nodeColor={(n) => {
            switch (n.type) {
              case 'agent': return '#e0e7ff';
              case 'functionTool': return '#fff7ed';
              case 'runner': return '#dcfce7';
              case 'guardrail': return '#fee2e2';
              default: return '#ffffff';
            }
          }}
          nodeBorderRadius={2}
        />
        <Background color="#aaa" gap={16} />
        
        <Panel position="top-right" className="bg-white p-3 rounded-lg shadow-md w-64">
          <div className="flex flex-col space-y-3 mb-6">
            <Tooltip title="启用/禁用连接验证">
              <div className="flex items-center">
                <SafetyOutlined className="mr-2 text-blue-500" />
                <span className="text-sm mr-2">连接验证</span>
                <Switch 
                  size="small" 
                  checked={connectionValidationMode} 
                  onChange={toggleConnectionValidation}
                />
              </div>
            </Tooltip>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <Tooltip title="查看已连接的节点">
              <div className="flex items-center">
                <LinkOutlined className="mr-2 text-green-500" />
                <span className="text-sm mr-2">连接数</span>
                <Badge 
                  count={edges.length} 
                  style={{ backgroundColor: edges.length > 0 ? '#52c41a' : '#d9d9d9' }}
                />
              </div>
            </Tooltip>
          </div>
          
          <button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
            onClick={() => setIsCodeModalOpen(true)}
          >
            生成代码
          </button>
        </Panel>
      </ReactFlow>
      
      {/* 代码生成弹窗 */}
      <CodeModal 
        isOpen={isCodeModalOpen} 
        onClose={() => setIsCodeModalOpen(false)} 
      />
    </div>
  );
};

export default Canvas;
