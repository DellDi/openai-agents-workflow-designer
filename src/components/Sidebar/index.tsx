import { useState } from 'react';
import { Layout, Typography, Button, Card, Avatar, Collapse, List } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  ApiOutlined, 
  RocketOutlined, 
  ToolOutlined, 
  SafetyOutlined 
} from '@ant-design/icons';
import { NodeTypes } from '@/types';

const { Sider } = Layout;
const { Text, Title } = Typography;
const { Panel } = Collapse;

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: NodeTypes) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodeItems = [
    {
      type: 'agent',
      title: 'Agent 节点',
      icon: <ApiOutlined />,
      color: '#3498db',
      bgColor: 'rgba(52, 152, 219, 0.1)',
      borderColor: '#3498db',
    },
    {
      type: 'runner',
      title: 'Runner 执行器',
      icon: <RocketOutlined />,
      color: '#e74c3c',
      bgColor: 'rgba(231, 76, 60, 0.1)',
      borderColor: '#e74c3c',
    },
    {
      type: 'functionTool',
      title: 'Function Tool',
      icon: <ToolOutlined />,
      color: '#f39c12',
      bgColor: 'rgba(243, 156, 18, 0.1)',
      borderColor: '#f39c12',
    },
    {
      type: 'guardrail',
      title: 'Guardrail 守护墙',
      icon: <SafetyOutlined />,
      color: '#9b59b6',
      bgColor: 'rgba(155, 89, 182, 0.1)',
      borderColor: '#9b59b6',
    },
  ];

  const instructions = [
    '拖放组件到画布',
    '连接组件建立关系',
    '点击组件修改属性',
    '点击生成代码按钮'
  ];

  return (
    <Sider
      width={expanded ? 250 : 80}
      theme="light"
      collapsible
      collapsed={!expanded}
      onCollapse={(collapsed) => setExpanded(!collapsed)}
      trigger={null}
      style={{ borderRight: '1px solid #f0f0f0' }}
    >
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
        {expanded && <Title level={5} style={{ margin: 0 }}>组件库</Title>}
        <Button 
          type="text"
          icon={expanded ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          onClick={() => setExpanded(!expanded)}
        />
      </div>
      
      <div style={{ padding: '16px' }}>
        {nodeItems.map((item) => (
          <Card
            key={item.type}
            size="small"
            style={{ 
              marginBottom: '12px', 
              background: item.bgColor, 
              borderColor: item.borderColor,
              cursor: 'grab'
            }}
            bodyStyle={{ padding: '12px' }}
            onDragStart={(event) => onDragStart(event, item.type as NodeTypes)}
            draggable
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                icon={item.icon} 
                style={{ 
                  backgroundColor: item.bgColor, 
                  color: item.color,
                  marginRight: expanded ? '8px' : '0'
                }} 
              />
              {expanded && <Text style={{ color: item.color }}>{item.title}</Text>}
            </div>
          </Card>
        ))}
      </div>
      
      {expanded && (
        <Collapse ghost style={{ borderTop: '1px solid #f0f0f0' }}>
          <Panel header="使用说明" key="1">
            <List
              size="small"
              dataSource={instructions}
              renderItem={(item, index) => (
                <List.Item style={{ padding: '4px 0' }}>
                  <Text>{index + 1}. {item}</Text>
                </List.Item>
              )}
            />
          </Panel>
        </Collapse>
      )}
    </Sider>
  );
};

export default Sidebar;
