const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '工具名称不能为空'],
    trim: true
  },
  category: {
    type: String,
    required: [true, '工具分类不能为空'],
    trim: true
  },
  url: {
    type: String,
    required: [true, '工具链接不能为空'],
    trim: true,
    validate: {
      validator: function(value) {
        if (!value) return false;
        return /^https?:\/\//.test(value) || value.startsWith('/') || value.startsWith('./') || value.startsWith('../');
      },
      message: '请输入有效的链接（支持 http://、https:// 或 / 开头的相对路径）'
    }
  },
  logo: {
    type: String,
    trim: true,
    default: ''
  },
  icon: {
    type: String,
    default: '🔧'
  },
  version: {
    type: String,
    default: '1.0.0'
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  access: {
    type: String,
    enum: ['all', 'admin', '研发', '非研发'],
    default: 'all'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// 更新时自动更新 updated_at
toolSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updated_at = Date.now();
  }
  next();
});

module.exports = mongoose.model('Tool', toolSchema);

