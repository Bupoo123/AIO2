const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jeyi-toolhub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ 已连接到 MongoDB');

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      $or: [{ username: 'admin' }, { email: 'admin@jeyi.com' }]
    });

    // 先加密密码
    const passwordHash = await bcrypt.hash('123456', 10);
    
    if (existingUser) {
      // 如果用户已存在，更新为管理员并重置密码
      // 注意：直接设置 password_hash，绕过 pre('save') 钩子，避免二次加密
      await User.updateOne(
        { _id: existingUser._id },
        { 
          $set: { 
            role: 'admin',
            password_hash: passwordHash,
            login_attempts: 0
          },
          $unset: { lock_until: 1 }
        }
      );
      console.log('✅ 用户已存在，已更新为管理员并重置密码');
    } else {
      // 创建新管理员用户
      // 直接插入，使用已加密的密码，避免 pre('save') 二次加密
      await User.create({
        username: 'admin',
        email: 'admin@jeyi.com',
        password_hash: passwordHash,
        role: 'admin'
      });
      console.log('✅ 管理员账号创建成功！');
    }

    // 显示用户信息
    const user = await User.findOne({ username: 'admin' });
    console.log('\n📋 管理员账号信息：');
    console.log('   用户名: admin');
    console.log('   邮箱: admin@jeyi.com');
    console.log('   密码: 123456');
    console.log('   角色: admin');
    console.log('   用户ID:', user._id);

    process.exit(0);
  } catch (error) {
    console.error('❌ 创建管理员失败:', error.message);
    process.exit(1);
  }
}

createAdmin();

