# Vercel 环境变量快速配置指南

## 📋 需要配置的 4 个环境变量

在 Vercel 的 "Environment Variables" 页面，点击 **"+ Add More"** 按钮，逐个添加以下变量：

---

### 1️⃣ MONGODB_URI（MongoDB 连接字符串）

**Key（变量名）**：
```
MONGODB_URI
```

**Value（变量值）**：
```
mongodb+srv://AIO2admin:31493170@cluster0.gpq75zd.mongodb.net/jeyi-toolhub?retryWrites=true&w=majority
```

**说明**：
- 这是你的 MongoDB Atlas 连接字符串
- 用户名：`AIO2admin`
- 密码：`31493170`
- 数据库名：`jeyi-toolhub`

**Environment（环境）**：选择 **Production, Preview, Development**（全部勾选）

点击 **"Save"** 保存

---

### 2️⃣ JWT_SECRET（JWT 加密密钥）

**Key（变量名）**：
```
JWT_SECRET
```

**Value（变量值）**：
生成一个强随机字符串（至少 32 个字符）

**快速生成方法**：
在终端运行：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

或者使用这个示例值（建议自己生成）：
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**Environment（环境）**：选择 **Production, Preview, Development**（全部勾选）

点击 **"Save"** 保存

---

### 3️⃣ NODE_ENV（环境模式）

**Key（变量名）**：
```
NODE_ENV
```

**Value（变量值）**：
```
production
```

**Environment（环境）**：选择 **Production, Preview, Development**（全部勾选）

点击 **"Save"** 保存

---

### 4️⃣ FRONTEND_URL（前端地址）

**Key（变量名）**：
```
FRONTEND_URL
```

**Value（变量值）**：
```
https://aio-2-git-master-bupoos-projects.vercel.app
```

**说明**：
- 这是你的 Vercel 项目域名
- 如果域名不同，请使用实际的域名
- 确保包含 `https://` 前缀

**Environment（环境）**：选择 **Production, Preview, Development**（全部勾选）

点击 **"Save"** 保存

---

## ✅ 配置完成后检查清单

配置完所有 4 个环境变量后，你应该看到：

| Key | Value（部分显示） | Environment |
|-----|------------------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | Production, Preview, Development |
| `JWT_SECRET` | `a1b2c3d4...` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production, Preview, Development |
| `FRONTEND_URL` | `https://aio-2-git-master...` | Production, Preview, Development |

---

## 🚀 配置完成后

1. **重新部署项目**：
   - 回到项目页面
   - 点击 "Deployments" 标签
   - 点击最新的部署
   - 点击 "Redeploy" 按钮

2. **等待部署完成**（通常 1-2 分钟）

3. **测试网站**：
   - 访问：`https://aio-2-git-master-bupoos-projects.vercel.app`
   - 应该能看到登录页面

---

## ⚠️ 注意事项

1. **每个环境变量都要选择所有环境**（Production, Preview, Development）
2. **MONGODB_URI 中的密码不要有特殊字符**（如果有，需要 URL 编码）
3. **FRONTEND_URL 必须包含 `https://` 前缀**
4. **配置后必须重新部署才能生效**

---

配置完成后告诉我，我们继续下一步！🎉

