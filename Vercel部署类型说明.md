# Vercel 部署类型说明

## 📊 Vercel 的两种部署类型

### 1. Preview Deployments（预览部署）
- **URL 格式**：`https://aio-2-{hash}-bupoos-projects.vercel.app`
- **触发条件**：
  - 推送到非 `master/main` 分支
  - 创建 Pull Request
  - 手动触发预览部署
- **特点**：
  - 每次推送都会创建新的预览 URL
  - URL 包含唯一的哈希值
  - 用于测试和预览

### 2. Production Deployments（生产部署）
- **URL 格式**：`https://aio-2.vercel.app` 或自定义域名
- **触发条件**：
  - 推送到 `master` 或 `main` 分支（默认生产分支）
  - 手动提升预览部署为生产部署
- **特点**：
  - 使用固定的生产 URL
  - 通常用于正式环境

## 🔍 你当前看到的情况

你看到的 URL：`https://aio-2-1rrgdsanm-bupoos-projects.vercel.app`

这是一个**预览部署**，因为：
1. URL 包含哈希值 `1rrgdsanm`
2. 可能是推送到非生产分支，或者 Vercel 还没有识别生产分支

## 🚀 如何访问生产环境

### 方法 1：检查生产部署
1. 登录 Vercel 控制台
2. 进入项目 → **Deployments**
3. 查看是否有标记为 **Production** 的部署
4. 如果有，点击查看生产 URL

### 方法 2：提升预览部署为生产
1. 在 Vercel 控制台
2. 进入项目 → **Deployments**
3. 找到你想要的生产部署
4. 点击部署右侧的 **"..."** 菜单
5. 选择 **"Promote to Production"**（提升为生产）

### 方法 3：推送到生产分支
确保推送到 `master` 或 `main` 分支（Vercel 的默认生产分支）：
```bash
git checkout master
git push origin master
```

## ⚙️ 配置生产分支

如果默认分支不是 `master`，可以配置：

1. 进入 Vercel 项目设置
2. 进入 **Settings** → **Git**
3. 找到 **Production Branch**
4. 设置为你的生产分支（通常是 `master` 或 `main`）

## 📋 检查清单

- [ ] 确认当前分支是 `master` 或 `main`
- [ ] 检查 Vercel 项目设置中的 Production Branch
- [ ] 查看是否有 Production 部署
- [ ] 如果没有，手动提升预览部署为生产

## 🔗 获取生产 URL

生产环境的 URL 通常是：
- `https://aio-2.vercel.app`（项目名称）
- 或者你配置的自定义域名

你可以在 Vercel 控制台的 **Settings** → **Domains** 中查看所有可用的域名。

