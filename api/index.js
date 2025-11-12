// Vercel Serverless Function 入口
// 注意：Vercel 已经处理了 /api 前缀，所以这里需要创建新的 app 实例
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('../backend/config/db');
const errorHandler = require('../backend/middleware/errorHandler');

// 导入路由
const authRoutes = require('../backend/routes/auth');
const toolRoutes = require('../backend/routes/tools');
const versionRoutes = require('../backend/routes/version');
const userRoutes = require('../backend/routes/users');

// 连接数据库（serverless 函数中需要异步连接）
connectDB();

// 创建 Express 应用
const app = express();

// 安全中间件
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// 解析 JSON 请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '服务运行正常',
    timestamp: new Date().toISOString()
  });
});

// API 路由（注意：Vercel 已经处理了 /api 前缀，所以这里不需要再加 /api）
app.use('/auth', authRoutes);
app.use('/tools', toolRoutes);
app.use('/version', versionRoutes);
app.use('/users', userRoutes);

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.path
  });
});

// 错误处理中间件（必须放在最后）
app.use(errorHandler);

// Vercel serverless 函数导出
module.exports = app;

