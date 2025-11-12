# Vercel 404 错误排查指南

## 🔍 常见 404 原因

### 1. 路由配置问题
- ✅ **已修复**：更新了 `vercel.json`，添加了静态资源路由和根路径配置

### 2. 项目设置问题
检查 Vercel 项目设置：
- **Framework Preset**: 必须选择 **Other**（不要选择 React/Vue/Next.js）
- **Root Directory**: 设置为 `.`（项目根目录）
- **Build Command**: 留空
- **Output Directory**: 留空

### 3. 环境变量问题
确保已配置以下环境变量：
- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV=production`
- `FRONTEND_URL`（部署后更新为实际域名）

## 🛠️ 排查步骤

### 步骤 1：检查部署日志
1. 登录 Vercel 控制台
2. 进入项目 → **Deployments**
3. 点击最新的部署
4. 查看 **Build Logs** 和 **Function Logs**
5. 查找错误信息

### 步骤 2：测试 API 端点
访问以下 URL 测试 API 是否正常：
```
https://your-project.vercel.app/api/health
```

如果 API 返回正常，说明 serverless 函数配置正确。

### 步骤 3：检查静态资源
访问以下 URL 测试静态资源：
```
https://your-project.vercel.app/css/style.css
https://your-project.vercel.app/js/auth.js
```

如果这些资源可以访问，说明路由配置正确。

### 步骤 4：检查浏览器控制台
1. 打开浏览器开发者工具（F12）
2. 查看 **Console** 标签页的错误信息
3. 查看 **Network** 标签页，检查哪些资源加载失败

## 🔧 解决方案

### 方案 A：使用 rewrites（推荐）
如果 routes 不工作，可以尝试使用 rewrites：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/[...].js",
      "use": "@vercel/node"
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/:path*",
      "destination": "/frontend/:path*"
    }
  ]
}
```

### 方案 B：使用 public 目录
如果 frontend 目录不工作，可以：
1. 创建 `public` 目录
2. 将 `frontend/` 的内容复制到 `public/`
3. 修改 `vercel.json`：
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/[...].js"
    },
    {
      "src": "/(.*)",
      "dest": "public/$1"
    }
  ]
}
```

### 方案 C：检查文件路径
确保所有文件路径正确：
- HTML 中的路径：`/css/style.css`（绝对路径）
- 实际文件位置：`frontend/css/style.css`

## 📋 当前配置

当前 `vercel.json` 配置：
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
      "dest": "frontend/css/$1"
    },
    {
      "src": "/js/(.*)",
      "dest": "frontend/js/$1"
    },
    {
      "src": "/assets/(.*)",
      "dest": "frontend/assets/$1"
    },
    {
      "src": "/",
      "dest": "frontend/index.html"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ],
  "cleanUrls": true,
  "trailingSlash": false
}
```

## 🚀 下一步操作

1. **推送更新**：
   ```bash
   cd /Users/bupoo/Github/AIO2
   git add vercel.json
   git commit -m "修复 Vercel 404 问题：添加静态资源路由"
   git push
   ```

2. **等待部署**：Vercel 会自动检测并重新部署

3. **测试访问**：
   - 主页：`https://your-project.vercel.app/`
   - API：`https://your-project.vercel.app/api/health`

4. **如果仍然 404**：
   - 检查 Vercel 项目设置（Framework Preset 必须是 Other）
   - 查看部署日志中的错误信息
   - 尝试方案 B（使用 public 目录）

## 📞 获取帮助

如果问题仍然存在，请提供：
1. Vercel 部署日志的截图
2. 浏览器控制台的错误信息
3. 访问的具体 URL
4. 期望的行为 vs 实际的行为

