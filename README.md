# 🧩 杰毅生物研发工具集 (AIO2)

一个统一的入口平台，集中管理与展示杰毅生物内部开发的 HTML 工具。

## 📋 项目概述

- **项目名称**：杰毅生物研发工具集
- **项目目标**：构建统一的入口平台，集中管理与展示内部开发的 HTML 工具
- **技术栈**：Node.js + Express + MongoDB + HTML + JavaScript + CSS
- **部署方式**：Docker + Nginx

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- MongoDB >= 4.0.0（或 MongoDB Atlas）
- Docker & Docker Compose（生产环境推荐）
- npm 或 yarn

### 本地开发

#### 1. 克隆项目

```bash
git clone https://github.com/Bupoo123/AIO2.git
cd AIO2
```

#### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填写实际配置
nano .env
```

**必需的环境变量：**

```env
MONGODB_URI=mongodb://localhost:27017/jeyi-toolhub
JWT_SECRET=your-secret-key-change-this-in-production
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
```

#### 3. 安装依赖

```bash
# 安装后端依赖
cd backend
npm install
cd ..
```

#### 4. 启动 MongoDB

确保 MongoDB 服务正在运行：

```bash
# macOS (使用 Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# 或使用 Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### 5. 启动后端服务

```bash
cd backend
npm start
# 或使用开发模式（需要安装 nodemon）
npm run dev
```

后端服务将在 `http://localhost:3000` 启动。

#### 6. 启动前端服务

```bash
# 使用 Python
cd frontend
python3 -m http.server 3001

# 或使用 Node.js http-server
npx http-server -p 3001

# 或使用 VS Code Live Server 插件
```

前端服务将在 `http://localhost:3001` 启动。

#### 7. 创建管理员账号

```bash
cd backend
node scripts/createAdmin.js [工号] [密码]

# 示例：创建工号为 M0001，密码为 123456 的管理员
node scripts/createAdmin.js M0001 123456
```

### 生产环境部署（Docker）

#### 1. 准备服务器

- 安装 Docker 和 Docker Compose
- 确保服务器可以访问 MongoDB Atlas（或本地 MongoDB）

#### 2. 克隆项目

```bash
git clone https://github.com/Bupoo123/AIO2.git
cd AIO2
```

#### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填写生产环境配置
nano .env
```

**生产环境配置示例：**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=your-strong-random-secret-key-here
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

#### 4. 构建并启动服务

```bash
# 构建并启动所有服务
docker compose up -d --build

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f backend
```

#### 5. 创建管理员账号

```bash
# 进入后端容器
docker compose exec backend sh

# 在容器内执行
cd /app/backend
node scripts/createAdmin.js M0001 123456

# 或直接执行
docker compose exec backend node /app/backend/scripts/createAdmin.js M0001 123456
```

#### 6. 访问应用

- 前端：`http://your-server-ip`
- API：`http://your-server-ip/api`

## 📁 项目结构

```
AIO2/
├── backend/                 # 后端服务
│   ├── config/             # 配置文件
│   │   └── db.js          # MongoDB 连接配置
│   ├── models/            # 数据模型
│   │   ├── User.js        # 用户模型
│   │   ├── Tool.js        # 工具模型
│   │   └── Version.js     # 版本模型
│   ├── routes/            # 路由
│   │   ├── auth.js        # 认证路由
│   │   ├── tools.js       # 工具路由
│   │   ├── users.js       # 用户管理路由
│   │   └── version.js     # 版本路由
│   ├── middleware/        # 中间件
│   │   ├── authMiddleware.js  # 认证中间件
│   │   └── errorHandler.js    # 错误处理
│   ├── scripts/           # 脚本
│   │   └── createAdmin.js # 创建管理员脚本
│   ├── server.js          # 服务器入口
│   └── package.json       # 后端依赖
├── frontend/              # 前端页面
│   ├── assets/           # 静态资源
│   │   └── images/       # 图片
│   ├── css/
│   │   └── style.css     # 样式文件
│   ├── js/
│   │   ├── auth.js       # 认证相关
│   │   ├── tools.js      # 工具相关
│   │   ├── users.js      # 用户管理
│   │   └── main.js       # 主逻辑
│   └── index.html        # 主页面
├── api/                   # Vercel Serverless Functions
│   └── [...].js          # API 路由处理
├── aio2.conf             # Nginx 配置文件
├── docker-compose.yml    # Docker Compose 配置
├── Dockerfile            # Docker 镜像配置
├── .env.example          # 环境变量模板
└── README.md            # 项目说明
```

## 🔑 功能特性

### 用户管理模块
- ✅ 用户注册（工号格式：M0001-M9999）
- ✅ 用户登录（支持工号或邮箱登录）
- ✅ JWT 认证
- ✅ 密码加密存储（bcrypt）
- ✅ 登录失败锁定（5次失败锁定5分钟）
- ✅ 修改密码
- ✅ 修改邮箱（管理员）
- ✅ 权限分级（普通用户/管理员）
- ✅ 用户类型（研发/非研发）

### 工具展示模块
- ✅ 工具卡片式展示
- ✅ 分类筛选
- ✅ 搜索功能
- ✅ 工具链接（支持 http/https 和相对路径）
- ✅ 自定义工具 LOGO
- ✅ 权限控制（根据用户类型过滤工具）

### 管理后台
- ✅ 工具管理（增删改查）
- ✅ 用户管理（查看、修改角色、重置登录、删除）

## 📡 API 接口

### 认证接口

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `PUT /api/auth/password` - 修改密码
- `PUT /api/auth/profile` - 修改个人信息（邮箱）

### 工具接口

- `GET /api/tools` - 获取工具列表（支持分类和搜索）
- `GET /api/tools/categories` - 获取分类列表
- `GET /api/tools/:id` - 获取工具详情
- `POST /api/tools` - 创建工具（管理员）
- `PUT /api/tools/:id` - 更新工具（管理员）
- `DELETE /api/tools/:id` - 删除工具（管理员）

### 用户管理接口（管理员）

- `GET /api/users` - 获取用户列表
- `GET /api/users/:id` - 获取用户详情
- `PUT /api/users/:id/role` - 修改用户角色
- `PUT /api/users/:id/reset-login` - 重置用户登录尝试
- `DELETE /api/users/:id` - 删除用户

### 版本接口

- `GET /api/version/check` - 检查版本更新
- `GET /api/version/history/:toolId` - 获取版本历史

## 🔒 安全特性

- JWT 认证
- 密码 bcrypt 加密
- CORS 配置
- Helmet 安全头
- 登录失败锁定机制
- 输入验证
- 用户权限分级

## 🐳 Docker 部署

### 使用 Docker Compose（推荐）

```bash
# 启动所有服务
docker compose up -d

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f

# 停止服务
docker compose down

# 重新构建并启动
docker compose up -d --build
```

### 服务说明

- **backend**: Node.js 后端服务（端口 3000）
- **nginx**: Nginx 反向代理（端口 80/443）

## 📝 使用说明

### 注册账号

1. 访问前端页面
2. 点击"注册"标签
3. 填写工号（格式：M0001-M9999）
4. 填写公司邮箱（@matridx.com）
5. 选择用户类型（研发/非研发）
6. 设置密码（至少6位）
7. 完成注册

### 登录系统

- 使用工号或邮箱登录
- 登录成功后进入主界面

### 使用工具

- 在主界面浏览工具卡片
- 使用分类筛选或搜索功能
- 点击工具卡片在新标签页打开工具

### 管理后台（仅管理员）

- 点击右上角"管理后台"按钮
- 可以添加、编辑、删除工具
- 可以管理用户（修改角色、重置登录、删除）

## 🛠️ 开发说明

### 添加新工具

管理员可以在管理后台添加新工具，需要提供：
- 工具名称
- 分类
- 工具链接（支持 http://、https:// 或相对路径）
- LOGO（可选，图片 URL）
- 图标（备用，emoji）
- 版本号
- 描述
- 访问权限（所有用户/仅管理员/仅研发/仅非研发）

### 创建管理员账号

```bash
# 本地开发
cd backend
node scripts/createAdmin.js [工号] [密码]

# Docker 环境
docker compose exec backend node /app/backend/scripts/createAdmin.js [工号] [密码]
```

## 🔄 版本管理

### 查看版本标签

```bash
git tag -l
```

### 切换到稳定版本

```bash
git checkout v1.0.0
```

### 创建新版本标签

```bash
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0
```

## 📄 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `MONGODB_URI` | MongoDB 连接字符串 | `mongodb://localhost:27017/jeyi-toolhub` |
| `JWT_SECRET` | JWT 加密密钥 | 使用强随机字符串 |
| `PORT` | 后端服务端口 | `3000` |
| `NODE_ENV` | 运行环境 | `development` 或 `production` |
| `FRONTEND_URL` | 前端地址（CORS） | `http://localhost:3001` |

## 🚨 故障排查

### 后端服务无法启动

1. 检查 MongoDB 连接是否正常
2. 检查环境变量是否正确配置
3. 查看后端日志：`docker compose logs backend`

### 前端无法连接后端

1. 检查 `FRONTEND_URL` 配置是否正确
2. 检查 CORS 配置
3. 检查网络连接

### 管理员账号无法登录

1. 确认账号已创建：`node scripts/createAdmin.js`
2. 检查密码是否正确
3. 检查账号是否被锁定

## 📄 许可证

ISC

## 👥 作者

杰毅生物

## 🔗 相关链接

- GitHub 仓库：https://github.com/Bupoo123/AIO2
- 问题反馈：https://github.com/Bupoo123/AIO2/issues
