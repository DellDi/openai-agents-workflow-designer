import AgentNode from './AgentNode';
import RunnerNode from './RunnerNode';
import FunctionToolNode from './FunctionToolNode';
import GuardrailNode from './GuardrailNode';

export const nodeTypes = {
  agent: AgentNode,
  runner: RunnerNode,
  functionTool: FunctionToolNode,
  guardrail: GuardrailNode,
};
