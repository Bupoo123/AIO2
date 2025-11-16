const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT 验证中间件
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this-in-production');
    const user = await User.findById(decoded.userId).select('-password_hash -login_attempts -lock_until');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 将 user 转换为普通对象，确保包含所有字段
    req.user = {
      _id: user._id,
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      user_type: user.user_type || '非研发',
      employee_id: user.employee_id,
      created_at: user.created_at,
      last_login: user.last_login
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '无效的认证令牌'
    });
  }
};

// 管理员权限验证中间件
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: '需要管理员权限'
    });
  }
  next();
};

module.exports = { authenticate, requireAdmin };

