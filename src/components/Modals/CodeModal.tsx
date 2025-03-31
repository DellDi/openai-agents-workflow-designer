import React, { useState, useEffect } from 'react';
import { Modal, Typography, Tabs, message, Button } from 'antd';
import { CodeOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { useFlowStore } from '@/store/flowStore';
import { Node, Edge } from 'reactflow';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ParameterType {
  name: string;
  type: string;
  description?: string;
}

const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose }) => {
  const { nodes, edges } = useFlowStore();
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // 生成代码的函数
  const generateCode = () => {
    setLoading(true);
    // 模拟代码生成过程
    setTimeout(() => {
      const codeString = generateWorkflowCode(nodes, edges);
      setGeneratedCode(codeString);
      setLoading(false);
    }, 1000);
  };

  // 当弹窗打开时自动生成代码
  useEffect(() => {
    if (isOpen) {
      generateCode();
    }
  }, [isOpen]);

  // 复制代码到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode).then(() => {
      setCopySuccess(true);
      message.success('代码已复制到剪贴板！');
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // 从节点和边生成工作流代码
  const generateWorkflowCode = (nodes: Node[], edges: Edge[]) => {
    // 这里是代码生成逻辑，可根据实际需求自定义
    const agentNodes = nodes.filter(node => node.type === 'agent');
    const functionToolNodes = nodes.filter(node => node.type === 'functionTool');
    const runnerNodes = nodes.filter(node => node.type === 'runner');
    const guardrailNodes = nodes.filter(node => node.type === 'guardrail');

    let code = `from openai import OpenAI
from openai.types.beta.assistant import Assistant
from openai.types.beta.threads import Run, Thread
import os
import json
from typing import Dict, List, Optional, Union, Any

# 设置 OpenAI API 密钥
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# 定义函数工具
`;

    // 生成函数工具代码
    if (functionToolNodes.length > 0) {
      functionToolNodes.forEach(node => {
        const { name, parameters, returnType, implementation } = node.data;
        code += `
def ${name}(${parameters.map((p: ParameterType) => `${p.name}: ${p.type}`).join(', ')}) -> ${returnType}:
    """
    ${parameters.map((p: ParameterType) => `${p.name}: ${p.description || '无描述'}`).join('\n    ')}
    Returns:
        ${returnType}: 返回值
    """
    ${implementation || '# 实现代码'}
`;
      });
    }

    // 生成代理代码
    if (agentNodes.length > 0) {
      code += `
# 创建代理
`;
      agentNodes.forEach(node => {
        const { name, instructions, tools = [] } = node.data;
        const toolNames = tools.map((t: string) => t).join(', ');

        code += `
${name.toLowerCase().replace(/\s+/g, '_')}_assistant = client.beta.assistants.create(
    name="${name}",
    instructions="""${instructions}""",
    tools=[${toolNames ? `{"type": "function", "function": ${toolNames}}` : ''}],
    model="gpt-4-turbo-preview"
)
`;
      });
    }

    // 使用 edges 连接节点
    if (edges.length > 0) {
      code += `
# 设置节点间的连接关系
`;

      edges.forEach(edge => {
        code += `# 从 ${edge.source} 到 ${edge.target} 的连接\n`;
      });
    }

    // 生成执行器代码
    if (runnerNodes.length > 0) {
      code += `
# 创建执行环境
`;
      runnerNodes.forEach(node => {
        const { label, input, mode, context } = node.data;

        code += `
# 创建 ${label || '执行器'}
thread = client.beta.threads.create(
    messages=[
        {
            "role": "user",
            "content": """${input}"""
        }
    ]
)

# 运行代理
run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=${context ? context : 'agent_assistant.id'},
    ${mode === 'async' ? '# 异步模式' : '# 同步模式'}
)

# 检查运行状态
run_status = client.beta.threads.runs.retrieve(
    thread_id=thread.id,
    run_id=run.id
)

print(f"运行状态: {run_status.status}")
`;
      });
    }

    // 生成防护节点代码
    if (guardrailNodes.length > 0) {
      code += `
# 添加安全防护措施
`;
      guardrailNodes.forEach(node => {
        const { name, rules } = node.data;

        code += `
# ${name || '防护措施'}
def check_compliance(content: str) -> bool:
    """
    检查内容是否符合安全规则
    """
    compliance_rules = ${JSON.stringify(rules || ['内容不得包含有害信息'], null, 4)}

    # 实现检查逻辑
    for rule in compliance_rules:
        # 检查逻辑
        pass

    return True  # 默认通过检查
`;
      });
    }

    // 最后添加主函数
    code += `
if __name__ == "__main__":
    # 获取消息
    messages = client.beta.threads.messages.list(
        thread_id=thread.id
    )

    # 打印结果
    for message in messages.data:
        if message.role == "assistant":
            for content in message.content:
                if content.type == "text":
                    print(f"助手: {content.text.value}")
`;

    return code;
  };

  return (
    <Modal
      title={
        <div className="flex items-center text-blue-600">
          <CodeOutlined className="mr-2 text-xl" />
          <span>生成代码</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={[
        <Button
          key="copy"
          icon={copySuccess ? <CheckOutlined /> : <CopyOutlined />}
          onClick={copyToClipboard}
          className={copySuccess ? 'text-green-500' : ''}
        >
          {copySuccess ? '已复制' : '复制代码'}
        </Button>,
        <Button key="close" type="primary" onClick={onClose}>
          关闭
        </Button>
      ]}
    >
      <Tabs defaultActiveKey="python">
        <TabPane tab="Python" key="python">
          <div className="bg-gray-50 p-4 rounded-md">
            <pre className="whitespace-pre-wrap text-sm">
              {loading ? '生成代码中...' : generatedCode}
            </pre>
          </div>
        </TabPane>
        <TabPane tab="使用说明" key="instructions">
          <Typography>
            <Title level={4}>如何使用生成的代码</Title>
            <Paragraph>
              生成的代码基于 OpenAI Assistants API，您需要按照以下步骤使用：
            </Paragraph>
            <ol className="ml-6 mb-4">
              <li>确保您已经安装了 OpenAI Python 库：<code>pip install openai</code></li>
              <li>设置您的 OpenAI API 密钥作为环境变量：<code>export OPENAI_API_KEY="your-api-key"</code></li>
              <li>将生成的代码保存到一个 Python 文件中，例如 <code>workflow.py</code></li>
              <li>根据需要修改代码中的函数实现和参数</li>
              <li>运行代码：<code>python workflow.py</code></li>
            </ol>
            <Paragraph>
              <Text strong>注意：</Text> 生成的代码可能需要根据您的具体需求进行调整。尤其是函数工具的实现部分，
              您可能需要添加实际的业务逻辑。
            </Paragraph>
          </Typography>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default CodeModal;
