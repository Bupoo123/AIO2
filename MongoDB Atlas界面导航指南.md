# 🧭 MongoDB Atlas 界面导航指南

## 📍 如何找到 Database Access 和 Network Access

### 方法一：通过顶部导航栏

1. **查看顶部导航栏**
   - 在页面顶部，找到 **"Security"** 或 **"Access"** 菜单
   - 点击 **"Security"** 下拉菜单
   - 应该能看到：
     - **"Database Access"** - 数据库用户管理
     - **"Network Access"** - 网络访问配置

### 方法二：通过左侧菜单（新界面）

在新版 MongoDB Atlas 界面中：

1. **查看左侧菜单底部**
   - 滚动到左侧菜单底部
   - 可能有一个 **"Security"** 或 **"Access"** 部分
   - 展开后可以看到：
     - Database Access
     - Network Access

### 方法三：直接访问 URL

如果找不到菜单，可以直接访问：

1. **Database Access（数据库用户）**
   - URL 格式：`https://cloud.mongodb.com/v2#/org/你的组织ID/access/users`
   - 或点击：顶部导航 → Security → Database Access

2. **Network Access（网络访问）**
   - URL 格式：`https://cloud.mongodb.com/v2#/org/你的组织ID/access/ipWhitelist`
   - 或点击：顶部导航 → Security → Network Access

### 方法四：通过项目设置

1. **点击顶部导航栏的项目名称**
   - 点击 **"PROJECT: Project 0"** 下拉菜单
   - 查看是否有 **"Security"** 或 **"Access"** 选项

2. **或点击组织名称**
   - 点击 **"ORGANIZATION: 序's Org - 2025-10-04"** 下拉菜单
   - 查看安全相关选项

## 🔍 当前界面分析

从你的截图可以看到：
- 左侧菜单显示的是集群相关功能（Overview, Data Explorer 等）
- 顶部导航栏有组织、项目、集群选择器
- 右上角有用户图标和设置图标

**Database Access 和 Network Access 通常在：**
- 顶部导航栏的 **"Security"** 菜单
- 或点击右上角的 **用户图标** → **"Access Manager"**
- 或直接访问 Security 页面

## 📝 快速操作步骤

### 步骤 1：找到 Security 菜单

1. **查看顶部导航栏**
   - 在页面顶部，查找 **"Security"** 文字或图标
   - 通常在右侧，靠近用户图标

2. **或点击右上角图标**
   - 点击右上角的 **用户图标**（头像）
   - 查看下拉菜单中是否有 **"Access Manager"** 或 **"Security"**

### 步骤 2：进入 Database Access

1. 点击 **"Security"** → **"Database Access"**
2. 或直接访问：`https://cloud.mongodb.com/v2#/access/users`

### 步骤 3：进入 Network Access

1. 点击 **"Security"** → **"Network Access"**
2. 或直接访问：`https://cloud.mongodb.com/v2#/access/ipWhitelist`

## 🎯 如果还是找不到

### 方案 A：使用搜索功能

1. 在页面顶部查找 **搜索框** 或 **"Search"** 按钮
2. 搜索 "Database Access" 或 "Network Access"

### 方案 B：查看帮助文档

1. 点击右上角的 **问号图标**（帮助）
2. 搜索 "Database Access" 或 "Network Access"

### 方案 C：直接访问链接

在浏览器地址栏中，当前 URL 可能是：
```
https://cloud.mongodb.com/v2#/org/.../clusters/...
```

修改为：
- Database Access: `https://cloud.mongodb.com/v2#/access/users`
- Network Access: `https://cloud.mongodb.com/v2#/access/ipWhitelist`

## 💡 提示

- 新版本的 MongoDB Atlas 界面可能将 Security 功能放在了不同的位置
- 如果界面是中文，可能显示为 **"安全"** 或 **"访问"**
- 也可以尝试点击页面右上角的 **设置图标**（齿轮图标）

---

**告诉我你看到了什么菜单选项，我可以帮你更精确地定位！**

