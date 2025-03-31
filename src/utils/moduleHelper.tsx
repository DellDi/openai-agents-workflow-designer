/**
 * 模块导入辅助工具
 * 这个文件帮助解决TypeScript模块导入问题
 */

import { FC } from 'react';
import { EdgeProps } from 'reactflow';
import { FlowNodeProps } from '@/types';

// 导入节点组件
const importNodeComponent = (nodePath: string): FC<FlowNodeProps> => {
  try {
    // 动态导入组件
    // 注意: 这在实际运行时不会被解析，只是为了类型提示
    return require(`@/components/Nodes/${nodePath}`).default;
  } catch (error) {
    console.error(`无法导入节点组件: ${nodePath}`, error);
    return (() => <div>加载错误</div>) as FC<FlowNodeProps>;
  }
};

// 导入边组件
const importEdgeComponent = (edgePath: string): FC<EdgeProps> => {
  try {
    return require(`@/components/Edges/${edgePath}`).default;
  } catch (error) {
    console.error(`无法导入边组件: ${edgePath}`, error);
    return (() => <div>加载错误</div>) as FC<EdgeProps>;
  }
};

// 导入配置组件
const importConfigComponent = (configPath: string): FC<any> => {
  try {
    return require(`@/components/ConfigPanel/${configPath}`).default;
  } catch (error) {
    console.error(`无法导入配置组件: ${configPath}`, error);
    return (() => <div>加载错误</div>) as FC<any>;
  }
};

// 记录已载入的模块，避免重复加载
const loadedModules: Record<string, any> = {};

/**
 * 加载节点组件
 */
export const getNodeComponent = (type: string): FC<FlowNodeProps> => {
  const key = `node_${type}`;
  if (!loadedModules[key]) {
    loadedModules[key] = importNodeComponent(`${type.charAt(0).toUpperCase() + type.slice(1)}Node`);
  }
  return loadedModules[key];
};

/**
 * 加载边组件
 */
export const getEdgeComponent = (type: string = 'default'): FC<EdgeProps> => {
  const key = `edge_${type}`;
  if (!loadedModules[key]) {
    loadedModules[key] = importEdgeComponent(`${type.charAt(0).toUpperCase() + type.slice(1)}Edge`);
  }
  return loadedModules[key];
};

/**
 * 加载配置组件
 */
export const getConfigComponent = (type: string): FC<any> => {
  const key = `config_${type}`;
  if (!loadedModules[key]) {
    loadedModules[key] = importConfigComponent(`${type.charAt(0).toUpperCase() + type.slice(1)}Config`);
  }
  return loadedModules[key];
};
