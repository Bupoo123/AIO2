const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false;

const connectDB = async () => {
  // 如果已经连接，直接返回
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  // 如果正在连接中，等待连接完成
  if (mongoose.connection.readyState === 2) {
    return new Promise((resolve, reject) => {
      mongoose.connection.once('connected', resolve);
      mongoose.connection.once('error', reject);
    });
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jeyi-toolhub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Serverless 环境优化配置
      maxPoolSize: 10, // 连接池大小
      serverSelectionTimeoutMS: 5000, // 服务器选择超时
      socketTimeoutMS: 45000, // Socket 超时
    });
    isConnected = true;
    console.log(`✅ MongoDB 连接成功: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error.message);
    isConnected = false;
    // Vercel serverless 函数中不要 exit，只记录错误
    if (!process.env.VERCEL && !process.env.VERCEL_ENV) {
      process.exit(1);
    }
    throw error; // 重新抛出错误，让调用者处理
  }
};

module.exports = connectDB;

