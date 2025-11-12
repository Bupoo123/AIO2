# 🚀 Vercel + MongoDB Atlas 部署指南

## 📋 部署架构

- **前端**: Vercel（静态网站）
- **后端**: Vercel Serverless Functions（Node.js API）
- **数据库**: MongoDB Atlas（云数据库）

## 🎯 部署步骤

### 第一步：设置 MongoDB Atlas（云数据库）

1. **注册 MongoDB Atlas 账号**
   - 访问 https://www.mongodb.com/cloud/atlas
   - 点击 "Try Free" 注册账号（免费 512MB）

2. **创建集群**
   - 登录后点击 "Build a Database"
   - 选择免费套餐（M0 Sandbox）
   - 选择云服务商和区域（建议选择离你最近的）
   - 点击 "Create"

3. **配置数据库访问**
   - 在 "Database Access" 中创建数据库用户：
     - Username: `aio2admin`（可自定义）
     - Password: 生成强密码（**保存好！**）
     - Database User Privileges: `Atlas admin`
   - 在 "Network Access" 中添加 IP 地址：
     - 点击 "Add IP Address"
     - 选择 "Allow Access from Anywhere"（`0.0.0.0/0`）
     - 或者添加 Vercel 的 IP 范围（更安全）

4. **获取连接字符串**
   - 点击 "Connect" → "Connect your application"
   - 选择 "Node.js" 和版本 "5.5 or later"
   - 复制连接字符串，格式如下：
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - 将 `<username>` 和 `<password>` 替换为刚才创建的用户名和密码
   - 在连接字符串末尾添加数据库名称：
     ```
     mongodb+srv://aio2admin:your-password@cluster0.xxxxx.mongodb.net/jeyi-toolhub?retryWrites=true&w=majority
     ```

### 第二步：准备代码

代码已经配置好，可以直接部署。主要修改：

1. ✅ 前端 API 地址已自动适配（生产环境使用相对路径）
2. ✅ 后端已支持 Vercel Serverless Functions
3. ✅ 已创建 Vercel 配置文件

### 第三步：部署到 Vercel

#### 方法一：通过 Vercel 网站部署（推荐）

1. **访问 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 在 "Import Git Repository" 中找到 `AIO2` 仓库
   - 点击 "Import"

3. **配置项目**
   
   **项目设置**：
   - Framework Preset: **Other** ⭐（重要：必须选择 Other，不要选择其他框架）
   - Root Directory: **`.`**（项目根目录，保持默认）
   - Build Command: **留空**（不需要构建，前端是静态文件）
   - Output Directory: **留空**（不需要输出目录）
   
   ⚠️ **重要提示**：
   - 不要选择 React、Vue、Next.js 等框架预设
   - 不要选择 Angular、Svelte 等
   - 必须选择 **Other** 或保持默认（None）

   **环境变量**（重要！）：
   点击 "Environment Variables" 添加以下变量：
   
   ```
   MONGODB_URI=mongodb+srv://aio2admin:your-password@cluster0.xxxxx.mongodb.net/jeyi-toolhub?retryWrites=true&w=majority
   JWT_SECRET=your-very-strong-secret-key-change-this-in-production
   NODE_ENV=production
   FRONTEND_URL=https://your-project-name.vercel.app
   ```
   
   ⚠️ **重要提示**：
   - `MONGODB_URI`: 使用第一步获取的 MongoDB Atlas 连接字符串
   - `JWT_SECRET`: 生成一个强随机字符串（可以使用 `openssl rand -hex 32`）
   - `FRONTEND_URL`: 先留空，部署后会显示域名，再回来更新

4. **部署**
   - 点击 "Deploy"
   - 等待部署完成（约 2-3 分钟）

5. **配置路由**
   - 部署完成后，Vercel 会自动配置路由
   - 前端访问：`https://your-project-name.vercel.app`
   - API 访问：`https://your-project-name.vercel.app/api/...`

6. **更新环境变量**
   - 部署完成后，复制你的域名
   - 回到项目设置 → Environment Variables
   - 更新 `FRONTEND_URL` 为你的实际域名
   - 重新部署（Redeploy）

#### 方法二：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 在项目根目录部署
cd /Users/bupoo/Github/AIO2
vercel

# 设置环境变量
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add NODE_ENV
vercel env add FRONTEND_URL

# 生产环境部署
vercel --prod
```

### 第四步：创建管理员账号

部署完成后，需要创建管理员账号：

**方法一：使用脚本（推荐）**

1. 在本地运行创建脚本：
```bash
cd /Users/bupoo/Github/AIO2/backend
# 修改 scripts/createAdmin.js 中的 MongoDB URI 为 Atlas 连接字符串
node scripts/createAdmin.js
```

**方法二：使用 MongoDB Compass**

1. 下载 MongoDB Compass：https://www.mongodb.com/products/compass
2. 使用 Atlas 连接字符串连接
3. 找到 `users` 集合
4. 插入管理员用户或修改现有用户角色为 `admin`

**方法三：使用 MongoDB Shell**

```bash
# 安装 MongoDB Shell
# macOS: brew install mongosh
# 或下载：https://www.mongodb.com/try/download/shell

# 连接 Atlas
mongosh "mongodb+srv://aio2admin:password@cluster0.xxxxx.mongodb.net/jeyi-toolhub"

# 创建管理员
db.users.insertOne({
  username: "admin",
  email: "admin@jeyi.com",
  password_hash: "$2a$10$...", // 需要先加密密码
  role: "admin"
})
```

### 第五步：测试部署

1. **访问网站**
   - 打开 `https://your-project-name.vercel.app`
   - 应该能看到登录页面

2. **测试功能**
   - 注册新账号
   - 使用管理员账号登录
   - 测试工具管理功能
   - 测试用户管理功能

## 🔧 配置说明

### 环境变量详解

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `MONGODB_URI` | MongoDB Atlas 连接字符串 | `mongodb+srv://...` |
| `JWT_SECRET` | JWT 加密密钥（强随机字符串） | `a1b2c3d4e5f6...` |
| `NODE_ENV` | 环境模式 | `production` |
| `FRONTEND_URL` | 前端访问地址 | `https://your-project.vercel.app` |

### 生成 JWT_SECRET

```bash
# 方法一：使用 OpenSSL
openssl rand -hex 32

# 方法二：使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📝 部署后检查清单

- [ ] MongoDB Atlas 集群已创建
- [ ] 数据库用户已创建
- [ ] 网络访问已配置（允许 Vercel IP）
- [ ] Vercel 项目已创建
- [ ] 环境变量已配置
- [ ] 项目已部署成功
- [ ] 前端页面可以访问
- [ ] API 接口可以访问
- [ ] 管理员账号已创建
- [ ] 登录功能正常
- [ ] 工具管理功能正常

## 🔒 安全建议

1. **MongoDB Atlas 安全**
   - 使用强密码
   - 限制 IP 访问（只允许 Vercel IP）
   - 定期更换密码

2. **JWT_SECRET**
   - 使用强随机字符串
   - 不要提交到 Git
   - 定期更换

3. **环境变量**
   - 所有敏感信息都通过环境变量配置
   - 不要硬编码在代码中

## 🐛 常见问题

### 1. 部署失败：找不到模块

**原因**：Vercel 需要安装依赖

**解决**：
- 确保 `backend/package.json` 存在
- Vercel 会自动运行 `npm install`

### 2. API 返回 404

**原因**：路由配置问题

**解决**：
- 检查 `vercel.json` 配置
- 确保 API 路径以 `/api/` 开头

### 3. 无法连接 MongoDB

**原因**：网络访问限制或连接字符串错误

**解决**：
- 检查 MongoDB Atlas Network Access 设置
- 确认连接字符串格式正确
- 检查用户名和密码是否正确

### 4. CORS 错误

**原因**：`FRONTEND_URL` 配置不正确

**解决**：
- 确认 `FRONTEND_URL` 与实际的 Vercel 域名一致
- 重新部署项目

## 📞 获取帮助

- **Vercel 文档**: https://vercel.com/docs
- **MongoDB Atlas 文档**: https://docs.atlas.mongodb.com
- **项目 Issues**: https://github.com/Bupoo123/AIO2/issues

## 🎉 部署完成

部署成功后，你的网站就可以通过以下地址访问：
- **前端**: `https://your-project-name.vercel.app`
- **API**: `https://your-project-name.vercel.app/api`

记得分享给你的团队成员！🚀

