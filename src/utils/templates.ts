import { v4 as uuidv4 } from 'uuid';
import { FlowNode, FlowEdge } from '@/types';

/**
 * 预设模板 - 基础Agent示例
 */
export const createBasicAgentTemplate = (): {nodes: FlowNode[], edges: FlowEdge[]} => {
  const agentId = uuidv4();
  const runnerId = uuidv4();

  const nodes: FlowNode[] = [
    {
      id: agentId,
      type: 'agent',
      position: { x: 250, y: 100 },
      data: {
        label: 'Agent',
        name: 'Assistant',
        instructions: 'You are a helpful assistant.',
        handoffs: [],
        tools: [],
      },
    },
    {
      id: runnerId,
      type: 'runner',
      position: { x: 250, y: 300 },
      data: {
        label: 'Runner',
        input: 'Write a haiku about recursion in programming.',
        mode: 'sync',
      },
    },
  ];

  const edges: FlowEdge[] = [
    {
      id: `e-${uuidv4()}`,
      source: agentId,
      target: runnerId,
      animated: true,
      style: { stroke: '#555' },
    },
  ];

  return { nodes, edges };
};

/**
 * 预设模板 - 多Agent协作示例
 */
export const createMultiAgentTemplate = (): {nodes: FlowNode[], edges: FlowEdge[]} => {
  const spanishAgentId = uuidv4();
  const englishAgentId = uuidv4();
  const triageAgentId = uuidv4();
  const runnerId = uuidv4();

  const nodes: FlowNode[] = [
    {
      id: spanishAgentId,
      type: 'agent',
      position: { x: 100, y: 100 },
      data: {
        label: 'Agent',
        name: 'Spanish agent',
        instructions: 'You only speak Spanish.',
        handoffs: [],
        tools: [],
      },
    },
    {
      id: englishAgentId,
      type: 'agent',
      position: { x: 400, y: 100 },
      data: {
        label: 'Agent',
        name: 'English agent',
        instructions: 'You only speak English.',
        handoffs: [],
        tools: [],
      },
    },
    {
      id: triageAgentId,
      type: 'agent',
      position: { x: 250, y: 250 },
      data: {
        label: 'Agent',
        name: 'Triage agent',
        instructions: 'Handoff to the appropriate agent based on the language of the request.',
        handoffs: [spanishAgentId, englishAgentId],
        tools: [],
      },
    },
    {
      id: runnerId,
      type: 'runner',
      position: { x: 250, y: 400 },
      data: {
        label: 'Runner',
        input: 'Hola, ¿cómo estás?',
        mode: 'async',
      },
    },
  ];

  const edges: FlowEdge[] = [
    {
      id: `e-${uuidv4()}`,
      source: spanishAgentId,
      target: triageAgentId,
      animated: true,
      style: { stroke: '#555' },
    },
    {
      id: `e-${uuidv4()}`,
      source: englishAgentId,
      target: triageAgentId,
      animated: true,
      style: { stroke: '#555' },
    },
    {
      id: `e-${uuidv4()}`,
      source: triageAgentId,
      target: runnerId,
      animated: true,
      style: { stroke: '#555' },
    },
  ];

  return { nodes, edges };
};

/**
 * 预设模板 - 带工具函数的示例
 */
export const createFunctionToolTemplate = (): {nodes: FlowNode[], edges: FlowEdge[]} => {
  const agentId = uuidv4();
  const toolId = uuidv4();
  const runnerId = uuidv4();

  const nodes: FlowNode[] = [
    {
      id: agentId,
      type: 'agent',
      position: { x: 250, y: 200 },
      data: {
        label: 'Agent',
        name: 'Hello world',
        instructions: 'You are a helpful agent.',
        handoffs: [],
        tools: [toolId],
      },
    },
    {
      id: toolId,
      type: 'functionTool',
      position: { x: 100, y: 100 },
      data: {
        label: 'Function Tool',
        name: 'get_weather',
        parameters: [{ name: 'city', type: 'str' }],
        returnType: 'str',
        implementation: 'return f"The weather in {city} is sunny."',
      },
    },
    {
      id: runnerId,
      type: 'runner',
      position: { x: 250, y: 350 },
      data: {
        label: 'Runner',
        input: "What's the weather in Tokyo?",
        mode: 'async',
      },
    },
  ];

  const edges: FlowEdge[] = [
    {
      id: `e-${uuidv4()}`,
      source: toolId,
      target: agentId,
      animated: true,
      style: { stroke: '#555' },
    },
    {
      id: `e-${uuidv4()}`,
      source: agentId,
      target: runnerId,
      animated: true,
      style: { stroke: '#555' },
    },
  ];

  return { nodes, edges };
};

/**
 * 加载预设模板
 */
export const loadTemplate = (templateId: 'basic' | 'multiAgent' | 'functionTool') => {
  switch (templateId) {
    case 'basic':
      return createBasicAgentTemplate();
    case 'multiAgent':
      return createMultiAgentTemplate();
    case 'functionTool':
      return createFunctionToolTemplate();
    default:
      return createBasicAgentTemplate();
  }
};
