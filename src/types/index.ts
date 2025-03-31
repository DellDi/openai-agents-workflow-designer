import { Node, Edge, ReactFlowInstance, NodeProps } from 'reactflow';

export type NodeTypes = 'agent' | 'runner' | 'functionTool' | 'guardrail';

// 节点通用数据结构
export interface NodeData {
  label: string;
  [key: string]: any;
}

// Agent节点数据结构
export interface AgentNodeData extends NodeData {
  name: string;
  instructions: string;
  handoff_description?: string;
  output_type?: string;
  handoffs: string[];
  tools: string[];
}

// Runner节点数据结构
export interface RunnerNodeData extends NodeData {
  input: string;
  mode: 'sync' | 'async';
  context?: string;
}

// Function Tool节点数据结构
export interface FunctionToolNodeData extends NodeData {
  name: string;
  parameters: Array<{
    name: string;
    type: string;
    description?: string;
  }>;
  returnType: 'str' | 'int' | 'float' | 'bool' | 'list' | 'dict' | 'None';
  implementation: string;
}

// Guardrail节点数据结构
export interface GuardrailNodeData extends NodeData {
  name: string;
  output_model?: string;
  guardrail_function?: string;
}

// 统一节点类型
export type FlowNode = Node<AgentNodeData | RunnerNodeData | FunctionToolNodeData | GuardrailNodeData>;

// 边类型
export type FlowEdge = Edge;

// 节点组件属性
export type FlowNodeProps = NodeProps<AgentNodeData | RunnerNodeData | FunctionToolNodeData | GuardrailNodeData>;

// 流程图状态类型
export interface FlowState {
  nodes: FlowNode[];
  edges: FlowEdge[];
  reactFlowInstance: ReactFlowInstance | null;
  selectedNode: FlowNode | null;
  isCodeModalOpen: boolean;
  generatedCode: string;
  connectionValidationMode: boolean; // 连接验证模式
  isDragging: boolean; // 拖拽状态

  // 操作方法
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  onNodeClick: (event: React.MouseEvent, node: FlowNode) => void;
  addNode: (type: NodeTypes, position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  setReactFlowInstance: (instance: ReactFlowInstance) => void;
  setSelectedNode: (node: FlowNode | null) => void;
  toggleConnectionValidation: () => void; // 切换连接验证模式
  generateCode: () => string;
  setIsCodeModalOpen: (isOpen: boolean) => void;
  loadTemplateFlow: (nodes: FlowNode[], edges: FlowEdge[]) => void;
  clearFlow: () => void;
}
