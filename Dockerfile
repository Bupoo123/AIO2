# 使用 Node.js 官方镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 文件
COPY backend/package*.json ./backend/
COPY package.json ./

# 安装后端依赖
WORKDIR /app/backend
RUN npm install --production

# 返回根目录
WORKDIR /app

# 复制所有文件
COPY . .

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 启动应用
WORKDIR /app/backend
CMD ["node", "server.js"]

