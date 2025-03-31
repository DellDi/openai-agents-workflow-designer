import { Layout, Typography, Button, Divider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useFlowStore } from '@/store/flowStore';
import { AgentNodeData, FunctionToolNodeData, GuardrailNodeData, RunnerNodeData } from '@/types';

// 导入各类型节点的配置组件
import AgentConfig from './AgentConfig';
import RunnerConfig from './RunnerConfig';
import FunctionToolConfig from './FunctionToolConfig';
import GuardrailConfig from './GuardrailConfig';

const { Sider } = Layout;
const { Title } = Typography;

const ConfigPanel = () => {
  const { selectedNode, setSelectedNode } = useFlowStore();

  if (!selectedNode) return null;
  
  // 根据节点类型返回不同的配置面板
  const renderConfigContent = () => {
    switch (selectedNode.type) {
      case 'agent':
        return <AgentConfig node={selectedNode} data={selectedNode.data as AgentNodeData} />;
      case 'runner':
        return <RunnerConfig node={selectedNode} data={selectedNode.data as RunnerNodeData} />;
      case 'functionTool':
        return <FunctionToolConfig node={selectedNode} data={selectedNode.data as FunctionToolNodeData} />;
      case 'guardrail':
        return <GuardrailConfig node={selectedNode} data={selectedNode.data as GuardrailNodeData} />;
      default:
        return <div>未知节点类型</div>;
    }
  };

  // 根据节点类型获取标题颜色
  const getTitleColor = () => {
    switch (selectedNode.type) {
      case 'agent': return '#3498db';
      case 'runner': return '#e74c3c';
      case 'functionTool': return '#f39c12';
      case 'guardrail': return '#9b59b6';
      default: return '#1677ff';
    }
  };

  return (
    <Sider 
      width={320} 
      theme="light"
      style={{ 
        borderLeft: '1px solid #f0f0f0',
        height: '100%',
        overflow: 'auto'
      }}
    >
      <div style={{ 
        padding: '16px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid #f0f0f0'
      }}>
        <Title level={5} style={{ margin: 0, color: getTitleColor() }}>属性配置</Title>
        <Button 
          type="text" 
          icon={<CloseOutlined />} 
          onClick={() => setSelectedNode(null)} 
        />
      </div>
      <Divider style={{ margin: '0' }} />
      <div style={{ padding: '16px' }}>
        {renderConfigContent()}
      </div>
    </Sider>
  );
};

export default ConfigPanel;
