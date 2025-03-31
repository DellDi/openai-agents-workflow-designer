import { memo } from 'react';
import { Typography, Steps, Card, Alert, Space } from 'antd';
import { 
  DragOutlined, 
  SettingOutlined, 
  NodeIndexOutlined, 
  CodeOutlined 
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const GettingStarted = () => {
  return (
    <Card bordered={false}>
      <Title level={4}>欢迎使用 OpenAI Agents 工作流设计器</Title>
      
      <Steps
        direction="vertical"
        size="small"
        className="mt-4"
        items={[
          {
            title: '从左侧拖放组件到画布',
            description: (
              <Paragraph type="secondary">
                从组件库中选择Agent、Runner、Function Tool或Guardrail，拖放到中央画布区域。
              </Paragraph>
            ),
            icon: <DragOutlined />
          },
          {
            title: '配置节点属性',
            description: (
              <Paragraph type="secondary">
                点击节点，在右侧面板中设置相关属性，如名称、指令、参数等。
              </Paragraph>
            ),
            icon: <SettingOutlined />
          },
          {
            title: '连接节点建立关系',
            description: (
              <Space direction="vertical" size={0}>
                <Paragraph type="secondary">
                  通过连接点拖线连接不同节点，建立工作流关系。例如：
                </Paragraph>
                <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                  <li><Text type="secondary">Agent → Agent: 建立转交(handoff)关系</Text></li>
                  <li><Text type="secondary">Function Tool → Agent: 为Agent添加工具</Text></li>
                  <li><Text type="secondary">Guardrail → Agent: 为Agent添加守护规则</Text></li>
                  <li><Text type="secondary">Agent → Runner: 建立执行关系</Text></li>
                </ul>
              </Space>
            ),
            icon: <NodeIndexOutlined />
          },
          {
            title: '生成并使用代码',
            description: (
              <Paragraph type="secondary">
                点击右上角"生成代码"按钮，查看和复制生成的OpenAI Agents SDK代码。
              </Paragraph>
            ),
            icon: <CodeOutlined />
          }
        ]}
      />
      
      <Alert
        message="小提示"
        description="完整的工作流通常包含至少一个Agent和一个Runner。如果需要自定义功能，可以添加Function Tool节点。"
        type="info"
        showIcon
        style={{ marginTop: 16 }}
      />
    </Card>
  );
};

export default memo(GettingStarted);
