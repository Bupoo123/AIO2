# Vercel 项目设置说明

## ⚠️ 重要：项目类型

**你的项目不是 Next.js！**

你的项目是：
- **前端**：纯静态 HTML/CSS/JS（在 `frontend/` 目录）
- **后端**：Express API（在 `api/[...].js` 作为 serverless 函数）

## ✅ 正确的 Vercel 项目设置

### Framework Preset（框架预设）
**必须选择：`Other` 或 `None`**

❌ **不要选择**：
- Next.js
- React
- Vue
- Angular
- Svelte
- 其他任何框架

✅ **应该选择**：
- **Other**（推荐）
- 或者保持默认（None）

### Build & Development Settings（构建设置）

#### Build Command（构建命令）
**留空**（不需要构建，前端是静态文件）

#### Output Directory（输出目录）
**留空**（不需要输出目录）

#### Install Command（安装命令）
**留空**（使用默认的 `npm install`）

#### Development Command（开发命令）
**留空**（不需要开发服务器）

### Root Directory（根目录）
**设置为：`.`**（项目根目录）

## 🔧 为什么移除了 builds 配置？

### 旧版配置（已移除）
```json
{
  "builds": [
    {
      "src": "api/[...].js",
      "use": "@vercel/node"
    }
  ]
}
```

### 新版配置（当前使用）
```json
{
  "version": 2,
  "rewrites": [...]
}
```

### 原因
1. **Vercel 自动识别**：`api/` 目录下的文件会自动识别为 serverless 函数
2. **不需要 builds**：现代 Vercel 不需要显式声明 builds
3. **避免冲突**：移除 builds 后，项目设置才会生效

## 📋 完整的项目设置检查清单

在 Vercel 控制台 → 项目 → Settings → General：

- [ ] **Framework Preset**: `Other` 或 `None`
- [ ] **Root Directory**: `.`
- [ ] **Build Command**: 留空
- [ ] **Output Directory**: 留空
- [ ] **Install Command**: 留空（或默认）
- [ ] **Development Command**: 留空

## 🚀 修复步骤

### 步骤 1：更新 Vercel 项目设置
1. 登录 Vercel 控制台
2. 进入 **AIO2** 项目
3. 进入 **Settings** → **General**
4. 找到 **Framework Preset**
5. 选择 **Other** 或 **None**
6. **Build Command** 留空
7. **Output Directory** 留空
8. 点击 **Save**

### 步骤 2：推送更新的配置
```bash
cd /Users/bupoo/Github/AIO2
git add vercel.json
git commit -m "移除 builds 配置，使用新版 Vercel 配置方式"
git push
```

### 步骤 3：重新部署
1. 等待自动部署，或
2. 手动触发重新部署（Redeploy）

## 🔍 验证配置

部署后检查：
1. ✅ 不再有 `builds` 警告
2. ✅ 前端页面可以访问
3. ✅ API 端点正常工作（`/api/health`）

## 📝 当前 vercel.json 配置

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/css/:path*",
      "destination": "/frontend/css/:path*"
    },
    {
      "source": "/js/:path*",
      "destination": "/frontend/js/:path*"
    },
    {
      "source": "/assets/:path*",
      "destination": "/frontend/assets/:path*"
    },
    {
      "source": "/",
      "destination": "/frontend/index.html"
    },
    {
      "source": "/:path*",
      "destination": "/frontend/:path*"
    }
  ],
  "cleanUrls": true,
  "trailingSlash": false
}
```

**注意**：
- ✅ 移除了 `builds` 配置
- ✅ 使用 `rewrites` 处理静态文件路由
- ✅ API 路由由 Vercel 自动处理（`api/` 目录）

## 🎯 总结

1. **项目设置**：Framework Preset = **Other**
2. **构建设置**：全部留空
3. **vercel.json**：移除 `builds`，使用 `rewrites`

这样就不会再有警告了！

