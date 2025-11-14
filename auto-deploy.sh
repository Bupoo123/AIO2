#!/bin/bash
# AIO2 自动部署脚本 - 在服务器上执行

set -e

echo "🚀 AIO2 自动部署脚本"
echo "===================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}请使用 root 或 sudo 权限运行此脚本${NC}"
    exit 1
fi

# 检测系统类型
if [ -f /etc/redhat-release ]; then
    # CentOS/RHEL 系统
    OS_TYPE="rhel"
    PKG_MANAGER="yum"
elif [ -f /etc/debian_version ]; then
    # Debian/Ubuntu 系统
    OS_TYPE="debian"
    PKG_MANAGER="apt"
else
    echo -e "${RED}不支持的系统类型${NC}"
    exit 1
fi

# 1. 更新系统
echo -e "${YELLOW}[1/8] 更新系统...${NC}"
if [ "$OS_TYPE" = "rhel" ]; then
    yum update -y
else
    apt update && apt upgrade -y
fi

# 2. 安装必要工具
echo -e "${YELLOW}[2/8] 安装必要工具...${NC}"
if [ "$OS_TYPE" = "rhel" ]; then
    yum install -y git curl wget
else
    apt install -y git curl wget
fi

# 3. 检查并安装 Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}[3/8] 安装 Docker...${NC}"
    if [ "$OS_TYPE" = "rhel" ]; then
        # CentOS/RHEL 安装 Docker
        yum install -y yum-utils
        yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
        yum install -y docker-ce docker-ce-cli containerd.io
        systemctl start docker
        systemctl enable docker
    else
        # Debian/Ubuntu 安装 Docker
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        rm get-docker.sh
    fi
else
    echo -e "${GREEN}[3/8] Docker 已安装${NC}"
    # 确保 Docker 服务运行
    if [ "$OS_TYPE" = "rhel" ]; then
        systemctl start docker
        systemctl enable docker
    fi
fi

# 4. 检查并安装 Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}[4/8] 安装 Docker Compose...${NC}"
    curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    echo -e "${GREEN}[4/8] Docker Compose 已安装${NC}"
fi

# 5. 克隆或更新项目
PROJECT_DIR="/opt/AIO2"
echo -e "${YELLOW}[5/8] 准备项目目录...${NC}"
if [ -d "$PROJECT_DIR" ]; then
    echo "项目目录已存在，更新代码..."
    cd $PROJECT_DIR
    git pull || echo "Git pull 失败，继续使用现有代码"
else
    echo "克隆项目..."
    mkdir -p /opt
    cd /opt
    git clone https://github.com/Bupoo123/AIO2.git
    cd $PROJECT_DIR
fi

# 6. 配置环境变量
echo -e "${YELLOW}[6/8] 配置环境变量...${NC}"
if [ ! -f "$PROJECT_DIR/.env" ]; then
    cp $PROJECT_DIR/env.example $PROJECT_DIR/.env
    echo ""
    echo -e "${YELLOW}请编辑 .env 文件配置以下变量：${NC}"
    echo "  - MONGODB_URI: MongoDB Atlas 连接字符串"
    echo "  - JWT_SECRET: JWT 加密密钥"
    echo "  - FRONTEND_URL: 前端访问地址"
    echo ""
    echo "使用命令编辑: nano $PROJECT_DIR/.env"
    echo ""
    read -p "按 Enter 继续（请确保已配置 .env 文件）..."
fi

# 7. 停止现有服务
echo -e "${YELLOW}[7/8] 停止现有服务...${NC}"
cd $PROJECT_DIR
docker-compose down 2>/dev/null || true

# 8. 构建并启动服务
echo -e "${YELLOW}[8/8] 构建并启动服务...${NC}"
docker-compose up -d --build

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}部署完成！${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "📊 服务状态："
docker-compose ps

echo ""
echo "🏥 健康检查："
if curl -s http://localhost/health > /dev/null; then
    echo -e "${GREEN}✅ 服务运行正常！${NC}"
else
    echo -e "${YELLOW}⚠️  服务可能还在启动中...${NC}"
fi

echo ""
echo "📱 访问地址: http://$(curl -s ifconfig.me)"
echo ""
echo "📝 常用命令："
echo "  查看日志: cd $PROJECT_DIR && docker-compose logs -f"
echo "  重启服务: cd $PROJECT_DIR && docker-compose restart"
echo "  停止服务: cd $PROJECT_DIR && docker-compose down"
echo ""

