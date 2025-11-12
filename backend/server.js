const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// 导入路由
const authRoutes = require('./routes/auth');
const toolRoutes = require('./routes/tools');
const versionRoutes = require('./routes/version');
const userRoutes = require('./routes/users');

// 连接数据库
connectDB();

// 创建 Express 应用
const app = express();

// 安全中间件
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
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

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/version', versionRoutes);
app.use('/api/users', userRoutes);

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

// 错误处理中间件（必须放在最后）
app.use(errorHandler);

// 启动服务器（兼容 Vercel 和本地开发）
const PORT = process.env.PORT || 3000;

// Vercel 使用 serverless 函数，不需要 listen
// 检查是否在 Vercel 环境（通过 VERCEL 环境变量或 serverless 函数）
if (process.env.VERCEL || process.env.VERCEL_ENV) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    console.log(`📝 环境: ${process.env.NODE_ENV || 'development'}`);
  });
}

