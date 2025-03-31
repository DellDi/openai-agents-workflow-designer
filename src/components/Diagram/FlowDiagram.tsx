import { memo } from 'react';

/**
 * 项目架构流程图组件
 * 使用mermaid格式展示工作流程
 */
const FlowDiagram = () => {
  const diagramCode = `
graph TD
  A[用户界面] --> B[组件层]
  B --> C[状态管理]
  C --> D[代码生成]
  
  subgraph 组件层
    B1[节点组件] --- B2[边缘组件]
    B1 --- B3[配置面板]
    B3 --- B4[代码预览]
  end
  
  subgraph 节点类型
    N1[Agent] --- N2[Runner]
    N1 --- N3[Function Tool]
    N1 --- N4[Guardrail]
  end
  
  subgraph 数据流
    F1[画布状态] --> F2[节点配置]
    F2 --> F3[代码生成]
  end
`;

  return (
    <div className="flow-diagram p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">工作流程图</h3>
      <div className="mermaid-diagram">
        <pre className="text-xs overflow-auto p-2 bg-gray-50 rounded">
          {diagramCode}
        </pre>
      </div>
    </div>
  );
};

export default memo(FlowDiagram);
