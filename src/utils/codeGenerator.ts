import { Edge } from 'reactflow';
import { 
  FlowNode, 
  AgentNodeData, 
  RunnerNodeData, 
  FunctionToolNodeData,
  GuardrailNodeData 
} from '@/types';

/**
 * 根据节点和边生成Python代码
 */
export const generatePythonCode = (nodes: FlowNode[], edges: Edge[]): string => {
  let imports: Set<string> = new Set(['from openai import OpenAI']);
  let functionTools: string[] = [];
  let agentDefinitions: string[] = [];
  let guardrailDefinitions: string[] = [];
  let runnerCode: string[] = [];
  
  // 检查是否有异步
  const hasAsync = nodes.some(node => 
    node.type === 'runner' && (node.data as RunnerNodeData).mode === 'async'
  );
  
  // 检查是否需要Pydantic模型
  const needsPydantic = nodes.some(node => 
    (node.type === 'agent' && (node.data as AgentNodeData).output_type) ||
    node.type === 'guardrail'
  );
  
  // 添加必要的导入
  if (hasAsync) {
    imports.add('import asyncio');
  }
  
  if (needsPydantic) {
    imports.add('from pydantic import BaseModel');
  }
  
  // 处理Guardrail节点，需要先生成输出模型
  const guardrailNodes = nodes.filter(node => node.type === 'guardrail');
  
  if (guardrailNodes.length > 0) {
    imports.add('from agents import InputGuardrail, GuardrailFunctionOutput');
    
    guardrailNodes.forEach(node => {
      const { /* name, */ output_model, guardrail_function } = (node.data as GuardrailNodeData);
      
      if (output_model) {
        guardrailDefinitions.push(`
class ${output_model}(BaseModel):
    # 输出模型定义 - 请根据实际需求修改
    is_valid: bool
    reasoning: str
`);
      }
      
      if (guardrail_function) {
        guardrailDefinitions.push(`
async def ${guardrail_function}(ctx, agent, input_data):
    result = await Runner.run(agent, input_data, context=ctx.context)
    final_output = result.final_output_as(${output_model || 'dict'})
    return GuardrailFunctionOutput(
        output_info=final_output,
        tripwire_triggered=not final_output.is_valid,
    )
`);
      }
    });
  }
  
  // 处理Function Tool节点
  const functionToolNodes = nodes.filter(node => node.type === 'functionTool');
  
  functionToolNodes.forEach(node => {
    const { name, implementation, parameters } = (node.data as FunctionToolNodeData);
    
    // 构建参数字符串，确保参数是数组
    const paramArray = Array.isArray(parameters) ? parameters : [];
    const paramString = paramArray
      .map(param => `${param.name}: ${param.type}`)
      .join(', ');
    
    // 使用实现代码作为函数体
    const functionBody = implementation || 'return "Function implementation"';
    
    const codeBlock = `
@function_tool
def ${name}(${paramString}) -> Any:
    ${functionBody.replace(/\n/g, '\n    ')}
`;
    
    functionTools.push(codeBlock);
  });
  
  if (functionTools.length > 0) {
    imports.add('from agents import function_tool');
  }
  
  // 处理Agent节点
  const agentNodes = nodes.filter(node => node.type === 'agent');
  
  // 节点查找助手函数
  const findNodeById = (id: string): FlowNode | undefined => {
    return nodes.find(node => node.id === id);
  };
  
  // 获取连接到Agent的Tools
  const getAgentTools = (agentId: string): string[] => {
    return edges
      .filter(edge => edge.target === agentId && 
              findNodeById(edge.source)?.type === 'functionTool')
      .map(edge => (findNodeById(edge.source)?.data as FunctionToolNodeData).name);
  };
  
  // 获取连接到Agent的Handoffs
  const getAgentHandoffs = (agentId: string): string[] => {
    return edges
      .filter(edge => edge.target === agentId && 
              findNodeById(edge.source)?.type === 'agent')
      .map(edge => (findNodeById(edge.source)?.data as AgentNodeData).name);
  };
  
  // 获取连接到Agent的Guardrails
  const getAgentGuardrails = (agentId: string): string[] => {
    return edges
      .filter(edge => edge.target === agentId && 
              findNodeById(edge.source)?.type === 'guardrail')
      .map(edge => (findNodeById(edge.source)?.data as GuardrailNodeData).guardrail_function || '');
  };
  
  // 生成Agent定义代码
  agentNodes.forEach(node => {
    const { name, instructions, handoff_description, output_type } = (node.data as AgentNodeData);
    
    // 获取Agent工具
    const tools = getAgentTools(node.id);
    const handoffs = getAgentHandoffs(node.id);
    const guardrails = getAgentGuardrails(node.id);
    
    let agentParams = [
      `name="${name}"`,
      `instructions="${instructions}"`
    ];
    
    if (handoff_description) {
      agentParams.push(`handoff_description="${handoff_description}"`);
    }
    
    if (output_type) {
      agentParams.push(`output_type=${output_type}`);
    }
    
    if (tools.length > 0) {
      agentParams.push(`tools=[${tools.join(', ')}]`);
    }
    
    if (handoffs.length > 0) {
      agentParams.push(`handoffs=[${handoffs.join(', ')}]`);
    }
    
    if (guardrails.length > 0) {
      agentParams.push(`input_guardrails=[
        InputGuardrail(guardrail_function=${guardrails[0]}),
    ]`);
    }
    
    const agentCode = `${name} = Agent(
    ${agentParams.join(',\n    ')}
)`;
    
    agentDefinitions.push(agentCode);
  });
  
  // 处理Runner节点
  const runnerNodes = nodes.filter(node => node.type === 'runner');
  
  if (runnerNodes.length > 0) {
    // 找到与Runner连接的Agent
    runnerNodes.forEach(node => {
      const { input, mode, context } = (node.data as RunnerNodeData);
      
      // 找到与Runner连接的Agent
      const connectedAgentEdge = edges.find(edge => 
        edge.target === node.id && findNodeById(edge.source)?.type === 'agent'
      );
      
      if (connectedAgentEdge) {
        const agentNode = findNodeById(connectedAgentEdge.source);
        if (agentNode) {
          const agentName = (agentNode.data as AgentNodeData).name;
          
          if (mode === 'sync') {
            runnerCode.push(`
result = Runner.run_sync(${agentName}, "${input}"${context ? `, context=${context}` : ''})
print(result.final_output)`);
          } else {
            runnerCode.push(`
async def main():
    result = await Runner.run(${agentName}, "${input}"${context ? `, context=${context}` : ''})
    print(result.final_output)

if __name__ == "__main__":
    asyncio.run(main())`);
          }
        }
      }
    });
  } else if (agentNodes.length > 0) {
    // 如果没有Runner节点但有Agent节点，为第一个Agent创建一个Runner
    const firstAgent = agentNodes[0];
    const agentName = (firstAgent.data as AgentNodeData).name;
    
    if (hasAsync) {
      runnerCode.push(`
async def main():
    result = await Runner.run(${agentName}, "请输入您的问题...")
    print(result.final_output)

if __name__ == "__main__":
    asyncio.run(main())`);
    } else {
      runnerCode.push(`
result = Runner.run_sync(${agentName}, "请输入您的问题...")
print(result.final_output)`);
    }
  }
  
  // 组合代码
  const fullCode = `${Array.from(imports).join('\n')}

${guardrailDefinitions.join('\n')}

${functionTools.join('\n')}

${agentDefinitions.join('\n\n')}

${runnerCode.join('\n')}`;
  
  return fullCode;
};
