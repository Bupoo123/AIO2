# Vercel 配置最终方案

## 🔍 问题分析

### 为什么需要 builds 配置？

对于 Express 应用作为 serverless 函数，Vercel **需要** `builds` 配置来：
1. 识别 Express 应用
2. 使用 `@vercel/node` 运行时
3. 正确打包和部署

### 警告信息的含义

```
WARN! Due to `builds` existing in your configuration file, 
the Build and Development Settings defined in your Project Settings will not apply.
```

这个警告的意思是：
- ✅ **正常现象**：当使用 `builds` 时，Vercel 会使用 `vercel.json` 的配置
- ✅ **不影响功能**：只是提醒你项目设置中的构建选项不会生效
- ✅ **可以忽略**：只要 `vercel.json` 配置正确即可

## ✅ 最终配置方案

### vercel.json（当前使用）

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/[...].js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/[...].js"
    },
    {
      "src": "/css/(.*)",
      "dest": "/frontend/css/$1"
    },
    {
      "src": "/js/(.*)",
      "dest": "/frontend/js/$1"
    },
    {
      "src": "/assets/(.*)",
      "dest": "/frontend/assets/$1"
    },
    {
      "src": "/",
      "dest": "/frontend/index.html"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "cleanUrls": true,
  "trailingSlash": false
}
```

### Vercel 项目设置

**Framework Preset**: `Other` 或 `None`

**Build & Development Settings**:
- Build Command: **留空**（使用 vercel.json 配置）
- Output Directory: **留空**（使用 vercel.json 配置）
- Install Command: **留空**（使用默认）
- Development Command: **留空**

**注意**：由于使用了 `builds`，这些设置不会生效，但保持留空即可。

## 🎯 为什么这样配置？

### 1. builds 配置
```json
"builds": [
  {
    "src": "api/[...].js",
    "use": "@vercel/node"
  }
]
```
- 告诉 Vercel 将 `api/[...].js` 作为 serverless 函数
- 使用 `@vercel/node` 运行时（支持 Express）

### 2. routes 配置
```json
"routes": [
  {
    "src": "/api/(.*)",
    "dest": "api/[...].js"
  },
  ...
]
```
- `/api/*` 请求路由到 serverless 函数
- 静态文件路由到 `frontend/` 目录
- 根路径路由到 `index.html`

## 📋 部署检查清单

- [x] `vercel.json` 包含 `builds` 配置
- [x] `vercel.json` 包含 `routes` 配置
- [x] API 文件在 `api/[...].js`
- [x] 前端文件在 `frontend/` 目录
- [x] 项目设置 Framework Preset = `Other`
- [x] 环境变量已配置

## 🚀 测试步骤

1. **测试 API**：
   ```
   https://your-project.vercel.app/api/health
   ```

2. **测试前端**：
   ```
   https://your-project.vercel.app/
   ```

3. **测试静态资源**：
   ```
   https://your-project.vercel.app/css/style.css
   https://your-project.vercel.app/js/auth.js
   ```

## ⚠️ 关于警告

**警告信息可以忽略**，因为：
1. 我们**需要** `builds` 配置来部署 Express 应用
2. 警告只是提醒项目设置不会生效
3. 只要 `vercel.json` 配置正确，功能就正常

## 🔧 如果仍然 404

1. **检查部署日志**：查看是否有构建错误
2. **检查环境变量**：确保所有必需的环境变量已配置
3. **检查文件路径**：确保所有文件路径正确
4. **清除缓存重新部署**：在 Vercel 控制台选择 "Clear build cache and redeploy"

## 📝 总结

- ✅ 使用 `builds` 配置是**正确的**（Express 应用需要）
- ✅ 警告信息可以**忽略**（不影响功能）
- ✅ 项目设置保持 `Other` 和留空即可
- ✅ 所有路由配置在 `vercel.json` 中


