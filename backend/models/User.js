const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  employee_id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  user_type: { type: String, enum: ['研发', '非研发'], default: '非研发' },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  password_hash: { type: String, required: true },

  login_attempts: { type: Number, default: 0 },
  lock_until: { type: Date },
  last_login: { type: Date },
}, {
  timestamps: { createdAt: 'created_at' }
});

// 账户是否锁定
userSchema.methods.isLocked = function () {
  return this.lock_until && this.lock_until > Date.now();
};

// 密码自动加密
userSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next();
  this.password_hash = await bcrypt.hash(this.password_hash, 10);
  next();
});

// 密码校验
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password_hash);
};

// 登录失败次数更新
userSchema.methods.incLoginAttempts = async function () {
  this.login_attempts += 1;
  if (this.login_attempts >= 5) {
    this.lock_until = new Date(Date.now() + 5 * 60 * 1000);
  }
  await this.save();
};

// 登录成功重置
userSchema.methods.resetLoginAttempts = async function () {
  this.login_attempts = 0;
  this.lock_until = null;
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
