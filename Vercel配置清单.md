# ✅ Vercel 配置清单

## 📋 环境变量配置清单

请按照以下清单，在 Vercel 中逐个添加环境变量：

### 1. MONGODB_URI ✅

- **变量名**：`MONGODB_URI`
- **变量值**：
```
mongodb+srv://AIO2admin:31493170@cluster0.gpq75zd.mongodb.net/jeyi-toolhub?retryWrites=true&w=majority
```
- **Environment**：✅ Production ✅ Preview ✅ Development（全部勾选）
- **状态**：✅ 已准备好

---

### 2. JWT_SECRET ⏳

- **变量名**：`JWT_SECRET`
- **变量值**：见下方（已生成）
- **Environment**：✅ Production ✅ Preview ✅ Development（全部勾选）
- **状态**：⏳ 等待生成

---

### 3. NODE_ENV ✅

- **变量名**：`NODE_ENV`
- **变量值**：`production`
- **Environment**：✅ Production ✅ Preview ✅ Development（全部勾选）
- **状态**：✅ 已准备好

---

### 4. FRONTEND_URL ⏳

- **变量名**：`FRONTEND_URL`
- **变量值**：`https://your-project-name.vercel.app`（部署后更新为实际域名）
- **Environment**：✅ Production ✅ Preview ✅ Development（全部勾选）
- **状态**：⏳ 部署后更新

---

## 🎯 Vercel 操作步骤

### 第一步：进入环境变量设置

1. 打开 Vercel Dashboard：https://vercel.com/dashboard
2. 找到并点击 **AIO2** 项目
3. 点击顶部菜单的 **"Settings"**（设置）
4. 在左侧菜单点击 **"Environment Variables"**（环境变量）

### 第二步：添加环境变量

点击 **"Add New"** 或 **"Add"** 按钮，逐个添加以下变量：

#### 变量 1：MONGODB_URI

1. **Key（变量名）**：输入 `MONGODB_URI`
2. **Value（变量值）**：粘贴以下内容
   ```
   mongodb+srv://AIO2admin:31493170@cluster0.gpq75zd.mongodb.net/jeyi-toolhub?retryWrites=true&w=majority
   ```
3. **Environment**：勾选所有环境
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. 点击 **"Save"**

#### 变量 2：JWT_SECRET

1. **Key（变量名）**：输入 `JWT_SECRET`
2. **Value（变量值）**：粘贴下方生成的密钥
   ```
   [见下方生成的密钥]
   ```
3. **Environment**：勾选所有环境
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. 点击 **"Save"**

#### 变量 3：NODE_ENV

1. **Key（变量名）**：输入 `NODE_ENV`
2. **Value（变量值）**：输入 `production`
3. **Environment**：勾选所有环境
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. 点击 **"Save"**

#### 变量 4：FRONTEND_URL

1. **Key（变量名）**：输入 `FRONTEND_URL`
2. **Value（变量值）**：
   - 如果还没部署：先输入 `https://aio2.vercel.app`（临时值）
   - 部署后：更新为实际域名
3. **Environment**：勾选所有环境
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. 点击 **"Save"**

### 第三步：验证环境变量

添加完成后，你应该看到 4 个环境变量：

| 变量名 | 值（部分显示） | 环境 |
|--------|---------------|------|
| MONGODB_URI | `mongodb+srv://AIO2admin...` | Production, Preview, Development |
| JWT_SECRET | `[生成的密钥]` | Production, Preview, Development |
| NODE_ENV | `production` | Production, Preview, Development |
| FRONTEND_URL | `https://...` | Production, Preview, Development |

### 第四步：重新部署

1. 回到项目页面（点击项目名称）
2. 点击 **"Deployments"** 标签
3. 找到最新的部署记录
4. 点击右侧的 **"..."** 菜单
5. 选择 **"Redeploy"**
6. 确认重新部署

或者：

1. 推送新代码到 GitHub
2. Vercel 会自动重新部署

### 第五步：获取域名并更新 FRONTEND_URL

1. 部署完成后，在项目页面查看 **"Domains"** 部分
2. 复制显示的域名（格式：`https://aio2-xxxxx.vercel.app`）
3. 回到 **Settings** → **Environment Variables**
4. 找到 `FRONTEND_URL`，点击 **"Edit"**
5. 更新为实际域名
6. 保存并重新部署

## ✅ 配置完成检查

- [ ] MONGODB_URI 已添加
- [ ] JWT_SECRET 已添加
- [ ] NODE_ENV 已添加
- [ ] FRONTEND_URL 已添加（可以先填临时值）
- [ ] 所有变量都选择了全部环境
- [ ] 已重新部署项目
- [ ] FRONTEND_URL 已更新为实际域名

## 🧪 测试部署

部署完成后，访问：

1. **健康检查**：
   ```
   https://your-project-name.vercel.app/api/health
   ```
   应该返回：`{"success":true,"message":"服务运行正常"}`

2. **网站首页**：
   ```
   https://your-project-name.vercel.app
   ```
   应该显示登录页面

3. **测试登录**：
   - 使用管理员账号：`admin` / `123456`
   - 或注册新账号

## 🐛 如果遇到问题

### 问题 1：环境变量不生效
- **解决**：确保重新部署了项目

### 问题 2：MongoDB 连接失败
- **检查**：MongoDB Atlas Network Access 是否允许所有 IP
- **检查**：连接字符串格式是否正确

### 问题 3：CORS 错误
- **解决**：确保 FRONTEND_URL 与实际域名一致

---

**按照这个清单一步步操作，就能完成配置！** 🚀

