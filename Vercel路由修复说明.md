# Vercel 404 错误修复说明

## 问题
访问 `https://aio-2-git-master-bupoos-projects.vercel.app` 时出现 404 错误。

## 已修复的问题

### 1. 静态资源路径
- 将 HTML 中的相对路径改为绝对路径（以 `/` 开头）
- `css/style.css` → `/css/style.css`
- `js/auth.js` → `/js/auth.js`
- 等等

### 2. Vercel 路由配置
更新了 `vercel.json`：
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.js"
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

## 下一步操作

### 1. 推送代码到 GitHub
如果刚才的 git push 失败，请手动执行：
```bash
cd /Users/bupoo/Github/AIO2
git push
```

### 2. 等待 Vercel 自动部署
- Vercel 会自动检测到 GitHub 的更新
- 等待部署完成（通常 1-2 分钟）

### 3. 如果仍然 404
如果修复后仍然出现 404，可能需要：

#### 方案 A：检查 Vercel 项目设置
1. 登录 Vercel 控制台
2. 进入项目设置
3. 检查 "Root Directory" 是否设置为项目根目录
4. 检查 "Framework Preset" 是否为 "Other"

#### 方案 B：手动触发重新部署
1. 在 Vercel 控制台
2. 进入 "Deployments" 标签
3. 点击最新的部署
4. 点击 "Redeploy"

#### 方案 C：如果仍然不行，考虑使用 public 目录
如果 Vercel 无法识别 `frontend/` 目录，可以：
1. 创建 `public` 目录
2. 将 `frontend/` 的内容复制到 `public/`
3. 修改 `vercel.json` 路由为 `"dest": "public/$1"`

## 验证步骤

部署完成后，访问：
- 主页：`https://aio-2-git-master-bupoos-projects.vercel.app`
- API 健康检查：`https://aio-2-git-master-bupoos-projects.vercel.app/api/health`

如果 API 返回正常，但前端仍然 404，说明路由配置需要进一步调整。


