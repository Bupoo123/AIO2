# Vercel 环境变量配置（简化版）

## 📋 需要添加的 4 个环境变量

在 Vercel 的 "Environment Variables" 页面，点击 **"+ Add More"** 按钮，逐个添加：

---

### 1️⃣ MONGODB_URI

**Key**：`MONGODB_URI`

**Value**：
```
mongodb+srv://AIO2admin:31493170@cluster0.gpq75zd.mongodb.net/jeyi-toolhub?retryWrites=true&w=majority
```

**注意**：如果界面有 Environment 选项，选择所有环境（Production, Preview, Development）。如果没有这个选项，直接保存即可，Vercel 会自动应用到所有环境。

---

### 2️⃣ JWT_SECRET

**Key**：`JWT_SECRET`

**Value**：
```
484a294c2d4f51bfa0767c012935105b4270d0247331e8168e2512f64638bac1
```

---

### 3️⃣ NODE_ENV

**Key**：`NODE_ENV`

**Value**：
```
production
```

---

### 4️⃣ FRONTEND_URL

**Key**：`FRONTEND_URL`

**Value**：
```
https://aio-2-git-master-bupoos-projects.vercel.app
```

---

## ✅ 关于 Environment 选项

**如果看不到 Environment 勾选选项**：
- 新版本的 Vercel 可能默认应用到所有环境
- 或者 Environment 选项在保存时才会出现
- **直接保存即可**，Vercel 会自动处理

**如果看到 Environment 选项**：
- 勾选 **Production**
- 勾选 **Preview**  
- 勾选 **Development**

---

## 🚀 配置完成后

1. 保存所有环境变量
2. 回到项目页面
3. 进入 "Deployments" 标签
4. 点击 "Redeploy" 重新部署

---

配置完成后告诉我！🎉

