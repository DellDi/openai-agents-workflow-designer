import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowInstance,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { message } from 'antd';

import { 
  FlowState, 
  NodeTypes, 
  FlowNode, 
  AgentNodeData, 
  RunnerNodeData, 
  FunctionToolNodeData,
  GuardrailNodeData
} from '@/types';
import { generatePythonCode } from '@/utils/codeGenerator';

const initialNodes: FlowNode[] = [];
const initialEdges: Edge[] = [];

// 创建不同类型节点的默认数据
const createNodeData = (type: NodeTypes, id: string): AgentNodeData | RunnerNodeData | FunctionToolNodeData | GuardrailNodeData => {
  switch (type) {
    case 'agent':
      return {
        label: 'Agent',
        name: `Agent_${id.slice(0, 4)}`,
        instructions: '请在此处输入Agent指令...',
        handoff_description: '',
        output_type: 'none',
        handoffs: [],
        tools: [],
      };
    case 'runner':
      return {
        label: 'Runner',
        input: '请在此处输入Runner输入内容...',
        mode: 'sync',
        context: '',
      };
    case 'functionTool':
      return {
        label: 'Function Tool',
        name: `function_${id.slice(0, 4)}`,
        parameters: [{ name: 'param1', type: 'str' }],
        returnType: 'str',
        implementation: 'return "Hello World"',
      };
    case 'guardrail':
      return {
        label: 'Guardrail',
        name: `Guardrail_${id.slice(0, 4)}`,
      };
  }
};

// 连接验证规则
const validateConnection = (connection: Connection, nodes: FlowNode[]): { valid: boolean; message: string } => {
  const { source, target } = connection;
  const sourceNode = nodes.find(node => node.id === source);
  const targetNode = nodes.find(node => node.id === target);
  
  if (!sourceNode || !targetNode) {
    return { valid: false, message: '无效的连接：节点不存在' };
  }
  
  // 验证规则
  // 1. Function Tool -> Agent (工具连接)
  if (sourceNode.type === 'functionTool' && targetNode.type === 'agent') {
    const targetData = targetNode.data as AgentNodeData;
    if (targetData.tools.includes(sourceNode.id)) {
      return { valid: false, message: '该工具已连接到此代理' };
    }
    return { valid: true, message: '有效连接：工具 -> 代理' };
  }
  
  // 2. Agent -> Agent (转交连接)
  if (sourceNode.type === 'agent' && targetNode.type === 'agent') {
    const targetData = targetNode.data as AgentNodeData;
    if (targetData.handoffs.includes(sourceNode.id)) {
      return { valid: false, message: '该代理已是转交目标' };
    }
    return { valid: true, message: '有效连接：代理 -> 代理（转交）' };
  }
  
  // 3. Agent -> Runner (执行连接)
  if (sourceNode.type === 'agent' && targetNode.type === 'runner') {
    return { valid: true, message: '有效连接：代理 -> 执行器' };
  }
  
  // 4. Guardrail -> Agent (防护连接)
  if (sourceNode.type === 'guardrail' && targetNode.type === 'agent') {
    return { valid: true, message: '有效连接：防护 -> 代理' };
  }
  
  // 默认情况：不允许连接
  return { 
    valid: false, 
    message: `无效连接：${sourceNode.type} -> ${targetNode.type}` 
  };
};

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  reactFlowInstance: null,
  selectedNode: null,
  isCodeModalOpen: false,
  generatedCode: '',
  connectionValidationMode: true, // 默认启用连接验证
  isDragging: false, // 拖拽状态标记

  // 节点变化处理
  onNodesChange: ((changes: NodeChange[]) => {
    // 检测是否有节点正在拖拽
    const isDragging = changes.some(
      change => change.type === 'position' && change.dragging === true
    );
    
    set({
      nodes: applyNodeChanges(changes, get().nodes),
      isDragging
    });
  }) as OnNodesChange,

  // 边变化处理
  onEdgesChange: ((changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  }) as OnEdgesChange,

  // 连接处理
  onConnect: ((connection: Connection) => {
    // 验证连接
    const validationResult = validateConnection(connection, get().nodes);
    
    // 如果启用了验证模式且连接无效，则显示提示并阻止连接
    if (get().connectionValidationMode && !validationResult.valid) {
      message.error(validationResult.message);
      return;
    }
    
    // 添加新的边
    const newEdge = {
      ...connection,
      id: `e-${uuidv4()}`,
      animated: true,
      style: { stroke: '#555' },
      data: { validationMessage: validationResult.message }
    } as Edge;
    
    set({
      edges: addEdge(newEdge, get().edges),
    });
    
    // 更新相关节点数据
    const { source, target } = connection;
    const sourceNode = get().nodes.find(node => node.id === source);
    const targetNode = get().nodes.find(node => node.id === target);
    
    if (!sourceNode || !targetNode) return;
    
    // 如果Function连接到Agent，将Function添加到Agent的tools列表中
    if (sourceNode.type === 'functionTool' && targetNode.type === 'agent') {
      const targetData = targetNode.data as AgentNodeData;
      if (!targetData.tools.includes(sourceNode.id)) {
        get().updateNodeData(targetNode.id, {
          tools: [...targetData.tools, sourceNode.id]
        });
      }
    }
    
    // 如果Agent连接到另一个Agent，将源Agent添加到目标Agent的handoffs列表中
    if (sourceNode.type === 'agent' && targetNode.type === 'agent') {
      const targetData = targetNode.data as AgentNodeData;
      if (!targetData.handoffs.includes(sourceNode.id)) {
        get().updateNodeData(targetNode.id, {
          handoffs: [...targetData.handoffs, sourceNode.id]
        });
      }
    }
    
    // 成功连接提示
    message.success(validationResult.message);
  }) as OnConnect,

  // 节点点击处理
  onNodeClick: (_, node) => {
    set({ selectedNode: node });
  },

  // 添加新节点
  addNode: (type: NodeTypes, position: { x: number; y: number }) => {
    const id = uuidv4();
    const newNode: FlowNode = {
      id,
      type,
      position,
      data: createNodeData(type, id),
    };

    set({
      nodes: [...get().nodes, newNode],
    });
  },

  // 更新节点数据
  updateNodeData: (nodeId: string, data: Partial<AgentNodeData | RunnerNodeData | FunctionToolNodeData | GuardrailNodeData>) => {
    set({
      nodes: get().nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          };
        }
        return node;
      }),
    });
  },

  // 设置ReactFlow实例
  setReactFlowInstance: (instance: ReactFlowInstance) => {
    set({ reactFlowInstance: instance });
  },

  // 设置选中节点
  setSelectedNode: (node: FlowNode | null) => {
    set({ selectedNode: node });
  },

  // 切换连接验证模式
  toggleConnectionValidation: () => {
    set({ connectionValidationMode: !get().connectionValidationMode });
  },

  // 生成代码
  generateCode: () => {
    const code = generatePythonCode(get().nodes, get().edges);
    set({ generatedCode: code });
    return code;
  },

  // 设置代码模态窗口状态
  setIsCodeModalOpen: (isOpen: boolean) => {
    if (isOpen) {
      // 打开模态窗口时生成代码
      get().generateCode();
    }
    set({ isCodeModalOpen: isOpen });
  },
  
  // 加载模板流程
  loadTemplateFlow: (nodes: FlowNode[], edges: Edge[]) => {
    set({
      nodes,
      edges,
    });
  },
  
  // 清空当前工作流
  clearFlow: () => {
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
    });
  },
}));
