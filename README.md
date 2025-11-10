# 🧩 杰毅生物研发工具集

一个统一的入口平台，集中管理与展示杰毅生物内部开发的 HTML 工具。

## 📋 项目概述

- **项目名称**：杰毅生物研发工具集
- **项目目标**：构建统一的入口平台，集中管理与展示内部开发的 HTML 工具
- **技术栈**：Node.js + Express + MongoDB + HTML + JavaScript + CSS

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- MongoDB >= 4.0.0
- npm 或 yarn

### 安装步骤

1. **安装后端依赖**

```bash
cd backend
npm install
```

2. **配置环境变量**

在 `backend` 目录下创建 `.env` 文件：

```env
MONGODB_URI=mongodb://localhost:27017/jeyi-toolhub
JWT_SECRET=your-secret-key-change-this-in-production
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

3. **启动 MongoDB**

确保 MongoDB 服务正在运行。

4. **启动后端服务**

```bash
cd backend
npm start
# 或使用开发模式（需要安装 nodemon）
npm run dev
```

后端服务将在 `http://localhost:3000` 启动。

5. **启动前端服务**

可以使用任何静态文件服务器，例如：

```bash
# 使用 Python
cd frontend
python3 -m http.server 8080

# 或使用 Node.js http-server
npx http-server -p 8080

# 或使用 VS Code Live Server 插件
```

前端服务将在 `http://localhost:8080` 启动。

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
│   │   └── version.js     # 版本路由
│   ├── middleware/        # 中间件
│   │   ├── authMiddleware.js  # 认证中间件
│   │   └── errorHandler.js    # 错误处理
│   ├── server.js          # 服务器入口
│   └── package.json       # 后端依赖
├── frontend/              # 前端页面
│   ├── css/
│   │   └── style.css     # 样式文件
│   ├── js/
│   │   ├── auth.js       # 认证相关
│   │   ├── tools.js      # 工具相关
│   │   └── main.js       # 主逻辑
│   └── index.html        # 主页面
├── package.json          # 项目配置
└── README.md            # 项目说明
```

## 🔑 功能特性

### 用户管理模块
- ✅ 用户注册（用户名、邮箱、密码）
- ✅ 用户登录（支持用户名或邮箱登录）
- ✅ JWT 认证
- ✅ 密码加密存储（bcrypt）
- ✅ 登录失败锁定（3次失败锁定5分钟）
- ✅ 修改密码
- ✅ 权限分级（普通用户/管理员）

### 工具展示模块
- ✅ 工具卡片式展示
- ✅ 分类筛选
- ✅ 搜索功能
- ✅ 从 GitHub 加载工具（iframe）
- ✅ 权限控制（普通用户只能访问 public 工具）

### 版本同步模块
- ✅ 版本检查
- ✅ 更新提示
- ✅ 版本历史记录

### 管理后台
- ✅ 工具管理（增删改查）
- ✅ 用户管理（查看、冻结、删除）

## 📡 API 接口

### 认证接口

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `PUT /api/auth/password` - 修改密码

### 工具接口

- `GET /api/tools` - 获取工具列表
- `GET /api/tools/categories` - 获取分类列表
- `GET /api/tools/:id` - 获取工具详情
- `POST /api/tools` - 创建工具（管理员）
- `PUT /api/tools/:id` - 更新工具（管理员）
- `DELETE /api/tools/:id` - 删除工具（管理员）

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

## 📝 使用说明

1. **注册账号**
   - 访问前端页面
   - 点击"注册"标签
   - 填写用户名、邮箱、密码
   - 完成注册

2. **登录系统**
   - 使用用户名或邮箱登录
   - 登录成功后进入主界面

3. **使用工具**
   - 在主界面浏览工具卡片
   - 使用分类筛选或搜索功能
   - 点击工具卡片打开工具（从 GitHub 加载）

4. **管理后台**（仅管理员）
   - 点击右上角"管理后台"按钮
   - 可以添加、编辑、删除工具
   - 可以管理用户

## 🛠️ 开发说明

### 添加新工具

管理员可以在管理后台添加新工具，需要提供：
- 工具名称
- 分类
- GitHub 链接（工具 HTML 页面的 URL）
- 图标（可选）
- 版本号
- 描述
- 访问权限

### 工具托管

所有工具文件托管在 GitHub 上，平台只管理元信息（名称、分类、链接等）。工具更新通过 GitHub 推送自动生效。

## 📄 许可证

ISC

## 👥 作者

杰毅生物

