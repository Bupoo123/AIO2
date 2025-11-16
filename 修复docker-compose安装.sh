#!/bin/bash
# 修复 docker-compose 安装

echo "🔧 修复 docker-compose 安装..."

# 删除错误的 docker-compose
rm -f /usr/local/bin/docker-compose

# 方法1：使用 pip 安装（推荐）
if command -v pip3 &> /dev/null; then
    echo "使用 pip3 安装 docker-compose..."
    pip3 install docker-compose
elif command -v pip &> /dev/null; then
    echo "使用 pip 安装 docker-compose..."
    pip install docker-compose
else
    echo "pip 未安装，使用 curl 下载..."
    # 方法2：直接下载二进制文件
    curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# 验证安装
if command -v docker-compose &> /dev/null; then
    docker-compose --version
    echo "✅ docker-compose 安装成功"
else
    echo "❌ docker-compose 安装失败"
    exit 1
fi

