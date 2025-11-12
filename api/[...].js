// Vercel Serverless Function 入口 - 使用动态路由捕获所有 /api/* 请求
// 注意：Vercel 的 [...].js 会捕获所有 /api/* 路径，req.url 会包含完整路径
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
  origin: process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? false : '*'),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 解析 JSON 请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '服务运行正常',
    timestamp: new Date().toISOString(),
    path: req.path,
    url: req.url,
    originalUrl: req.originalUrl
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
    path: req.path,
    url: req.url,
    originalUrl: req.originalUrl
  });
});

// 错误处理中间件（必须放在最后）
app.use(errorHandler);

// Vercel serverless 函数导出
module.exports = app;

