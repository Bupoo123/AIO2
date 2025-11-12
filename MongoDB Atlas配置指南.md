# 🗄️ MongoDB Atlas 配置完整指南

## 📋 配置步骤

### 第一步：注册 MongoDB Atlas 账号

1. **访问 MongoDB Atlas**
   - 打开浏览器，访问：https://www.mongodb.com/cloud/atlas
   - 点击右上角 **"Try Free"** 或 **"Sign Up"**

2. **注册账号**
   - 可以使用 Google 账号快速注册
   - 或使用邮箱注册（填写邮箱、密码、姓名等）
   - 完成邮箱验证

3. **选择套餐**
   - 选择 **"Free"**（M0 Sandbox - 免费 512MB）
   - 点击 **"Create"**

### 第二步：创建集群

1. **选择云服务商和区域**
   - Cloud Provider: 选择 **AWS**（推荐）或 **Google Cloud**
   - Region: 选择离你最近的区域（如：**Asia Pacific (ap-southeast-1) Singapore**）
   - Cluster Tier: 选择 **M0 Sandbox (FREE)**
   - Cluster Name: 可以保持默认 `Cluster0` 或自定义

2. **创建集群**
   - 点击 **"Create Cluster"**
   - 等待集群创建完成（约 3-5 分钟）

### 第三步：配置数据库访问（创建用户）

1. **进入 Database Access**
   - 集群创建完成后，会弹出配置向导
   - 点击 **"Create Database User"** 或
   - 在左侧菜单点击 **"Database Access"**

2. **创建数据库用户**
   - Authentication Method: 选择 **"Password"**
   - Username: 输入用户名（如：`aio2admin`）
   - Password: 
     - 点击 **"Autogenerate Secure Password"** 生成强密码
     - **重要**：复制并保存这个密码！稍后会用到
     - 或自己设置一个强密码（至少 8 个字符，包含大小写字母、数字）
   - Database User Privileges: 选择 **"Atlas admin"** 或 **"Read and write to any database"**
   - 点击 **"Add User"**

### 第四步：配置网络访问（允许连接）

1. **进入 Network Access**
   - 在左侧菜单点击 **"Network Access"**
   - 或从配置向导中点击 **"Add IP Address"**

2. **添加 IP 地址**
   - 点击 **"Add IP Address"** 按钮
   - 选择 **"Allow Access from Anywhere"**（`0.0.0.0/0`）
     - ⚠️ 这是为了允许 Vercel 访问，生产环境建议限制 IP
   - 点击 **"Confirm"**
   - 等待状态变为 **"Active"**（约 1-2 分钟）

### 第五步：获取连接字符串

1. **进入 Connect 页面**
   - 在左侧菜单点击 **"Database"**
   - 找到你的集群，点击 **"Connect"** 按钮
   - 或直接点击集群卡片上的 **"Connect"**

2. **选择连接方式**
   - 选择 **"Connect your application"**（连接你的应用）

3. **获取连接字符串**
   - Driver: 选择 **"Node.js"**
   - Version: 选择 **"5.5 or later"**
   - 复制连接字符串，格式如下：
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

4. **修改连接字符串**
   - 将 `<username>` 替换为第三步创建的用户名（如：`aio2admin`）
   - 将 `<password>` 替换为第三步创建的密码
   - **重要**：如果密码包含特殊字符，需要进行 URL 编码：
     - `@` → `%40`
     - `#` → `%23`
     - `$` → `%24`
     - `%` → `%25`
     - `&` → `%26`
     - `+` → `%2B`
     - `=` → `%3D`
   - 在连接字符串末尾添加数据库名称：
     ```
     mongodb+srv://aio2admin:your-password@cluster0.xxxxx.mongodb.net/jeyi-toolhub?retryWrites=true&w=majority
     ```
   - 最终格式：
     ```
     mongodb+srv://用户名:密码@cluster0.xxxxx.mongodb.net/jeyi-toolhub?retryWrites=true&w=majority
     ```

### 第六步：测试连接（可选）

可以使用 MongoDB Compass 或命令行工具测试连接：

**使用 MongoDB Compass**：
1. 下载：https://www.mongodb.com/products/compass
2. 打开 Compass
3. 粘贴连接字符串
4. 点击 "Connect"
5. 如果连接成功，说明配置正确

## 📝 配置检查清单

完成配置后，确认以下项目：

- [ ] MongoDB Atlas 账号已注册
- [ ] 免费集群已创建（M0 Sandbox）
- [ ] 数据库用户已创建（记住用户名和密码）
- [ ] 网络访问已配置（允许所有 IP 或 Vercel IP）
- [ ] 连接字符串已获取并修改完成
- [ ] 连接字符串中包含数据库名称 `jeyi-toolhub`
- [ ] 密码中的特殊字符已进行 URL 编码

## 🔐 安全建议

1. **密码安全**
   - 使用强密码（至少 12 个字符）
   - 包含大小写字母、数字、特殊字符
   - 不要使用常见密码

2. **网络访问限制**（可选，更安全）
   - 生产环境建议限制 IP 访问
   - 可以添加 Vercel 的 IP 范围
   - 但需要定期更新 IP 列表

3. **定期备份**
   - 免费版不提供自动备份
   - 重要数据建议定期手动导出

## 🐛 常见问题

### 1. 连接失败：Authentication failed

**原因**：用户名或密码错误

**解决**：
- 检查用户名和密码是否正确
- 确认密码中的特殊字符已进行 URL 编码
- 重新创建数据库用户

### 2. 连接失败：IP not whitelisted

**原因**：IP 地址未添加到白名单

**解决**：
- 检查 Network Access 配置
- 确认已添加 `0.0.0.0/0` 或你的 IP 地址
- 等待 1-2 分钟让配置生效

### 3. 连接字符串格式错误

**原因**：连接字符串格式不正确

**解决**：
- 确认包含数据库名称：`/jeyi-toolhub`
- 确认用户名和密码已替换
- 确认特殊字符已编码

### 4. 找不到连接字符串

**原因**：未选择正确的连接方式

**解决**：
- 选择 "Connect your application"
- 不要选择 "Connect with MongoDB Compass" 或其他方式

## 📞 需要帮助？

如果遇到问题：
1. 查看 MongoDB Atlas 官方文档：https://docs.atlas.mongodb.com
2. 检查 MongoDB Atlas 状态页面
3. 查看错误日志

---

配置完成后，将连接字符串复制到 Vercel 的环境变量 `MONGODB_URI` 中！

