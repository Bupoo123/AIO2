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
  github_url: {
    type: String,
    required: [true, 'GitHub链接不能为空'],
    trim: true,
    match: [/^https?:\/\/.+/, '请输入有效的URL']
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
    enum: ['all', 'admin'],
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

