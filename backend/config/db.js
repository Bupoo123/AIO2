const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false;

const connectDB = async () => {
  // 如果已经连接，直接返回
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jeyi-toolhub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log(`✅ MongoDB 连接成功: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error.message);
    // Vercel serverless 函数中不要 exit，只记录错误
    if (!process.env.VERCEL && !process.env.VERCEL_ENV) {
      process.exit(1);
    }
  }
};

module.exports = connectDB;

