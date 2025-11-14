# 🌐 Vercel 域名说明

## 📋 域名类型

### 1. 项目主域名（推荐使用）
- **格式**：`项目名-git-分支名-用户名.vercel.app`
- **示例**：`aio-2-git-master-bupoos-projects.vercel.app`
- **特点**：
  - ✅ 稳定，不会改变
  - ✅ 指向最新的生产部署
  - ✅ 适合用于 FRONTEND_URL

### 2. 部署域名
- **格式**：`项目名-随机ID-用户名.vercel.app`
- **示例**：`aio-2-os11jgo93-bupoos-projects.vercel.app`
- **特点**：
  - ⚠️ 每次部署可能不同
  - ⚠️ 指向特定的部署版本
  - ❌ 不适合用于 FRONTEND_URL

## 🎯 应该使用哪个？

### 推荐使用：`aio-2-git-master-bupoos-projects.vercel.app`

**原因**：
1. 这是项目主域名，稳定不变
2. 始终指向最新的生产部署
3. 适合配置到 FRONTEND_URL 环境变量

## 📝 配置步骤

### 更新 FRONTEND_URL

1. **进入 Vercel 项目设置**
   - Settings → Environment Variables

2. **编辑 FRONTEND_URL**
   - 找到 `FRONTEND_URL` 变量
   - 点击 "..." → "Edit"
   - 更新为：`https://aio-2-git-master-bupoos-projects.vercel.app`
   - 确保包含 `https://` 前缀
   - 保存

3. **重新部署**
   - 回到 Deployments
   - 重新部署以确保配置生效

## 🔍 如何确认主域名

在 Vercel 项目页面：
- 查看 "Domains" 部分
- 通常第一个列出的就是主域名
- 或者查看域名列表，带有 "git-master" 的是主域名

## ✅ 最终配置

**FRONTEND_URL 应该设置为**：
```
https://aio-2-git-master-bupoos-projects.vercel.app
```

---

**使用主域名，这样配置更稳定！** 🚀


