#!/bin/bash

# OpenAI Agents 工作流设计器启动脚本
echo "正在启动 OpenAI Agents 工作流设计器..."

# 切换到项目目录
cd "$(dirname "$0")/.."

# 确保依赖已安装
if [ ! -d "node_modules" ]; then
  echo "正在安装依赖..."
  pnpm install
fi

# 启动开发服务器
echo "启动开发服务器..."
pnpm dev
