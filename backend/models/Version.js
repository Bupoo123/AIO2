const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
  tool_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tool',
    required: [true, '工具ID不能为空']
  },
  version: {
    type: String,
    required: [true, '版本号不能为空'],
    trim: true
  },
  changelog: {
    type: String,
    trim: true,
    default: ''
  },
  released_at: {
    type: Date,
    default: Date.now
  }
});

// 版本号比较辅助方法（SemVer格式）
versionSchema.statics.compareVersions = function(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }
  return 0;
};

module.exports = mongoose.model('Version', versionSchema);

