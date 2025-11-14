#!/bin/bash
# SSH 连接脚本

SERVER_IP="120.26.172.158"
USERNAME="admin"
PASSWORD="Dx8E9Z+x5DvE@Ey"

echo "正在连接到服务器 $USERNAME@$SERVER_IP..."

# 使用 sshpass 自动输入密码（如果已安装）
if command -v sshpass &> /dev/null; then
    sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USERNAME@$SERVER_IP "$@"
else
    echo "未安装 sshpass，请手动输入密码"
    ssh -o StrictHostKeyChecking=no $USERNAME@$SERVER_IP "$@"
fi

