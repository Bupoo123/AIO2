# ⚡ MongoDB Atlas 快速配置步骤

## 🎯 5 分钟快速配置

### 步骤 1：注册并创建集群（2分钟）

1. 访问：https://www.mongodb.com/cloud/atlas
2. 点击 **"Try Free"** → 注册账号
3. 选择 **"Free"** 套餐
4. 选择区域（推荐：**Singapore** 或 **Tokyo**）
5. 点击 **"Create Cluster"**
6. 等待创建完成（约 3-5 分钟）

### 步骤 2：创建数据库用户（1分钟）

1. 在配置向导中点击 **"Create Database User"**
2. 输入用户名：`aio2admin`
3. 点击 **"Autogenerate Secure Password"** 生成密码
4. **重要**：复制并保存密码！
5. 点击 **"Add User"**

### 步骤 3：配置网络访问（30秒）

1. 点击 **"Add IP Address"**
2. 选择 **"Allow Access from Anywhere"**（`0.0.0.0/0`）
3. 点击 **"Confirm"**

### 步骤 4：获取连接字符串（1分钟）

1. 点击 **"Connect"** 按钮
2. 选择 **"Connect your application"**
3. 选择 **"Node.js"** 和 **"5.5 or later"**
4. 复制连接字符串

### 步骤 5：生成最终连接字符串（30秒）

**方法一：使用脚本（推荐）**

```bash
cd /Users/bupoo/Github/AIO2
node scripts/generateMongoURI.js
```

按照提示输入：
- 集群地址（从连接字符串中提取，如：`cluster0.xxxxx.mongodb.net`）
- 用户名（如：`aio2admin`）
- 密码（刚才保存的密码）
- 数据库名称（默认：`jeyi-toolhub`）

脚本会自动生成正确的连接字符串。

**方法二：手动修改**

从 MongoDB Atlas 复制的连接字符串格式：
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

修改为：
```
mongodb+srv://aio2admin:你的密码@cluster0.xxxxx.mongodb.net/jeyi-toolhub?retryWrites=true&w=majority
```

**注意**：如果密码包含特殊字符（如 `@`、`#`、`$` 等），需要进行 URL 编码：
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`

### 步骤 6：配置到 Vercel

1. 复制生成的连接字符串
2. 在 Vercel 项目设置中添加环境变量：
   - 变量名：`MONGODB_URI`
   - 变量值：粘贴连接字符串
3. 重新部署项目

## ✅ 配置完成检查

- [ ] 集群已创建（状态：Active）
- [ ] 数据库用户已创建（记住用户名和密码）
- [ ] 网络访问已配置（允许所有 IP）
- [ ] 连接字符串已生成（包含数据库名称）
- [ ] 已添加到 Vercel 环境变量

## 🎉 完成！

现在你的 MongoDB Atlas 已经配置完成，可以在 Vercel 中使用了！

---

**需要帮助？** 查看详细文档：`MongoDB Atlas配置指南.md`

