const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用户名不能为空'],
    unique: true,
    trim: true,
    minlength: [3, '用户名至少3个字符'],
    maxlength: [20, '用户名最多20个字符']
  },
  email: {
    type: String,
    required: [true, '邮箱不能为空'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, '请输入有效的邮箱地址']
  },
  password_hash: {
    type: String,
    required: [true, '密码不能为空'],
    minlength: [6, '密码至少6个字符']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  user_type: {
    type: String,
    enum: ['研发', '非研发'],
    default: '非研发'
  },
  employee_id: {
    type: String,
    trim: true,
    match: [/^M\d{4}$/, '工号格式错误，应为 M0001-M9999']
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  last_login: {
    type: Date
  },
  login_attempts: {
    type: Number,
    default: 0
  },
  lock_until: {
    type: Date
  }
});

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password_hash')) return next();
  this.password_hash = await bcrypt.hash(this.password_hash, 10);
  next();
});

// 密码验证方法
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

// 检查账户是否被锁定
userSchema.methods.isLocked = function() {
  return !!(this.lock_until && this.lock_until > Date.now());
};

// 处理登录失败
userSchema.methods.incLoginAttempts = async function() {
  // 如果锁定时间已过，重置尝试次数
  if (this.lock_until && this.lock_until < Date.now()) {
    return this.updateOne({
      $set: { login_attempts: 1 },
      $unset: { lock_until: 1 }
    });
  }
  
  const updates = { $inc: { login_attempts: 1 } };
  
  // 如果尝试次数达到3次，锁定5分钟
  if (this.login_attempts + 1 >= 3 && !this.isLocked()) {
    updates.$set = { lock_until: Date.now() + 5 * 60 * 1000 }; // 5分钟
  }
  
  return this.updateOne(updates);
};

// 重置登录尝试次数
userSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $set: { login_attempts: 0 },
    $unset: { lock_until: 1 }
  });
};

module.exports = mongoose.model('User', userSchema);

