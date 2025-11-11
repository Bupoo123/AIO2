#!/bin/bash

# 杰毅生物研发工具集 - 启动脚本

echo "🚀 启动杰毅生物研发工具集..."

# 检查 MongoDB 是否运行
if ! pgrep -x mongod > /dev/null; then
    echo "⚠️  MongoDB 未运行，请先启动 MongoDB"
    echo "   可以使用: brew services start mongodb-community"
    exit 1
fi

# 检查 .env 文件
if [ ! -f "backend/.env" ]; then
    echo "⚠️  未找到 backend/.env 文件"
    echo "   正在从 env.example 创建..."
    cp env.example backend/.env
    echo "✅ 已创建 .env 文件，请检查配置"
fi

# 检查依赖是否安装
if [ ! -d "backend/node_modules" ]; then
    echo "📦 安装后端依赖..."
    cd backend && npm install && cd ..
fi

# 启动后端服务
echo "🔧 启动后端服务 (端口 3000)..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 检查后端是否启动成功
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ 后端服务启动成功"
else
    echo "❌ 后端服务启动失败"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# 启动前端服务
echo "🌐 启动前端服务 (端口 3001)..."
cd frontend
python3 -m http.server 3001 &
FRONTEND_PID=$!
cd ..

echo ""
echo "✨ 服务启动完成！"
echo ""
echo "📱 前端地址: http://localhost:3001"
echo "🔧 后端 API: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo ''; echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

# 保持脚本运行
wait

