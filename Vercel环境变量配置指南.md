# 🔐 Vercel 环境变量配置详细步骤

## 📍 在 Vercel 中配置环境变量

### 第一步：进入项目设置

1. 在 Vercel  Dashboard 中，找到你的 **AIO2** 项目
2. 点击项目名称进入项目详情页
3. 点击顶部菜单栏的 **"Settings"**（设置）
4. 在左侧菜单中找到 **"Environment Variables"**（环境变量）
5. 点击进入环境变量配置页面

### 第二步：添加环境变量

点击 **"Add New"** 或 **"Add"** 按钮，逐个添加以下环境变量：

#### 1. MONGODB_URI（MongoDB 连接字符串）

**变量名**：`MONGODB_URI`

**变量值**：你的 MongoDB Atlas 连接字符串

**格式示例**：
```
mongodb+srv://用户名:密码@cluster0.xxxxx.mongodb.net/jeyi-toolhub?retryWrites=true&w=majority
```

**如何获取**：
1. 登录 MongoDB Atlas：https://cloud.mongodb.com
2. 选择你的集群
3. 点击 **"Connect"** 按钮
4. 选择 **"Connect your application"**
5. 选择 **"Node.js"** 和版本 **"5.5 or later"**
6. 复制连接字符串
7. 将 `<username>` 和 `<password>` 替换为你的数据库用户名和密码
8. 在连接字符串末尾添加数据库名称：`/jeyi-toolhub`

**重要提示**：
- 密码中的特殊字符需要 URL 编码（如 `@` 需要写成 `%40`）
- 确保连接字符串中包含数据库名称 `jeyi-toolhub`

**配置选项**：
- Environment: 选择 **Production, Preview, Development**（全部环境）
- 点击 **"Save"**

---

#### 2. JWT_SECRET（JWT 加密密钥）

**变量名**：`JWT_SECRET`

**变量值**：一个强随机字符串（至少 32 个字符）

**如何生成**：

**方法一：使用命令行（推荐）**
```bash
# macOS/Linux
openssl rand -hex 32

# 或使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**方法二：在线生成**
- 访问：https://randomkeygen.com/
- 选择 "CodeIgniter Encryption Keys"
- 复制一个 32 位或更长的密钥

**示例值**：
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

**配置选项**：
- Environment: 选择 **Production, Preview, Development**（全部环境）
- 点击 **"Save"**

---

#### 3. NODE_ENV（环境模式）

**变量名**：`NODE_ENV`

**变量值**：`production`

**配置选项**：
- Environment: 选择 **Production, Preview, Development**（全部环境）
- 点击 **"Save"**

---

#### 4. FRONTEND_URL（前端地址）

**变量名**：`FRONTEND_URL`

**变量值**：你的 Vercel 项目域名

**获取方式**：
1. 在 Vercel 项目页面，查看 **"Domains"** 部分
2. 复制显示的域名（格式：`https://your-project-name.vercel.app`）

**注意**：
- 如果还没有部署，可以先填写一个临时值
- 部署完成后，再更新为实际域名
- 确保包含 `https://` 前缀

**配置选项**：
- Environment: 选择 **Production, Preview, Development**（全部环境）
- 点击 **"Save"**

---

### 第三步：验证环境变量

添加完所有环境变量后，你应该看到以下列表：

| 变量名 | 值（部分显示） | 环境 |
|--------|---------------|------|
| `MONGODB_URI` | `mongodb+srv://...` | Production, Preview, Development |
| `JWT_SECRET` | `a1b2c3d4...` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production, Preview, Development |
| `FRONTEND_URL` | `https://...` | Production, Preview, Development |

### 第四步：重新部署

配置完环境变量后，需要重新部署项目：

1. 回到项目页面
2. 点击 **"Deployments"** 标签
3. 找到最新的部署记录
4. 点击右侧的 **"..."** 菜单
5. 选择 **"Redeploy"**
6. 确认重新部署

或者：

1. 在项目页面点击 **"Deployments"**
2. 点击 **"Redeploy"** 按钮（如果有）
3. 或者推送新的代码到 GitHub，Vercel 会自动重新部署

## 🔍 验证环境变量是否生效

部署完成后，可以通过以下方式验证：

### 方法一：查看部署日志

1. 在 Vercel 项目页面，点击 **"Deployments"**
2. 点击最新的部署记录
3. 查看 **"Build Logs"** 或 **"Function Logs"**
4. 应该能看到 MongoDB 连接成功的日志

### 方法二：测试 API

访问健康检查接口：
```
https://your-project-name.vercel.app/api/health
```

应该返回：
```json
{
  "success": true,
  "message": "服务运行正常",
  "timestamp": "2025-11-11T..."
}
```

### 方法三：测试登录功能

1. 访问你的网站
2. 尝试注册或登录
3. 如果环境变量配置正确，应该能正常连接数据库

## ⚠️ 常见问题

### 1. 环境变量不生效

**原因**：环境变量添加后没有重新部署

**解决**：
- 重新部署项目
- 确保环境变量选择了正确的环境（Production/Preview/Development）

### 2. MongoDB 连接失败

**原因**：
- 连接字符串格式错误
- 用户名或密码错误
- 网络访问未配置

**解决**：
- 检查连接字符串格式
- 确认 MongoDB Atlas 中已配置网络访问（允许所有 IP 或 Vercel IP）
- 检查用户名和密码是否正确

### 3. JWT_SECRET 错误

**原因**：JWT_SECRET 太短或包含特殊字符

**解决**：
- 使用至少 32 个字符的随机字符串
- 避免使用特殊字符，使用字母和数字

### 4. CORS 错误

**原因**：FRONTEND_URL 配置不正确

**解决**：
- 确认 FRONTEND_URL 与实际的 Vercel 域名一致
- 确保包含 `https://` 前缀
- 重新部署项目

## 📝 环境变量清单

部署前确认以下环境变量都已配置：

- [ ] `MONGODB_URI` - MongoDB Atlas 连接字符串
- [ ] `JWT_SECRET` - JWT 加密密钥（强随机字符串）
- [ ] `NODE_ENV` - 环境模式（production）
- [ ] `FRONTEND_URL` - 前端访问地址（Vercel 域名）

## 🔒 安全提示

1. **不要将环境变量提交到 Git**
   - 环境变量已经在 `.gitignore` 中
   - 只在 Vercel 中配置

2. **定期更换密钥**
   - 建议定期更换 `JWT_SECRET`
   - 更换后需要重新部署

3. **保护 MongoDB 密码**
   - 使用强密码
   - 不要分享连接字符串

4. **限制网络访问**
   - 在 MongoDB Atlas 中，可以限制只允许 Vercel 的 IP 访问
   - 更安全但需要定期更新 IP 列表

---

配置完成后，你的项目就可以正常访问了！🎉

