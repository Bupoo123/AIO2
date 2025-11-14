#!/bin/bash

# AIO2 阿里云部署脚本

set -e

echo "🚀 开始部署 AIO2 项目..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo "⚠️  未找到 .env 文件"
    echo "   正在从 env.example 创建..."
    cp env.example .env
    echo "✅ 已创建 .env 文件，请编辑 .env 文件配置环境变量"
    echo ""
    echo "需要配置的变量："
    echo "  - MONGODB_URI: MongoDB Atlas 连接字符串"
    echo "  - JWT_SECRET: JWT 加密密钥"
    echo "  - FRONTEND_URL: 前端访问地址（如：http://你的域名）"
    echo ""
    read -p "按 Enter 继续（请确保已配置 .env 文件）..."
fi

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down 2>/dev/null || true

# 构建镜像
echo "🔨 构建 Docker 镜像..."
docker-compose build

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 5

# 检查服务状态
echo "📊 检查服务状态..."
docker-compose ps

# 检查健康状态
echo ""
echo "🏥 检查健康状态..."
if curl -s http://localhost/health > /dev/null; then
    echo "✅ 服务运行正常！"
else
    echo "⚠️  服务可能还在启动中，请稍后访问 http://你的IP地址"
fi

echo ""
echo "✨ 部署完成！"
echo ""
echo "📱 访问地址: http://你的IP地址"
echo "🔧 API 地址: http://你的IP地址/api"
echo ""
echo "查看日志: docker-compose logs -f"
echo "停止服务: docker-compose down"
echo "重启服务: docker-compose restart"

