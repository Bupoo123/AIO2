const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

// 生成 JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key-change-this-in-production', {
    expiresIn: '7d'
  });
};

// 用户注册
router.post('/register', [
  body('employee_id')
    .notEmpty().withMessage('工号不能为空')
    .matches(/^M\d{4}$/).withMessage('工号格式错误，应为 M0001-M9999'),
  body('email')
    .isEmail().withMessage('请输入有效的邮箱地址')
    .custom((value) => {
      if (!value.endsWith('@matridx.com')) {
        throw new Error('邮箱必须是公司邮箱（@matridx.com）');
      }
      return true;
    }),
  body('password').isLength({ min: 6 }).withMessage('密码至少6个字符'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('两次输入的密码不一致');
    }
    return true;
  }),
  body('user_type').isIn(['研发', '非研发']).withMessage('用户类型必须是"研发"或"非研发"')
], async (req, res, next) => {
  try {
    // 添加调试日志
    console.log('注册请求数据:', JSON.stringify(req.body, null, 2));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('验证错误:', errors.array());
      return res.status(400).json({
        success: false,
        message: errors.array().map(e => e.msg).join(', ')
      });
    }

    const { employee_id, email, password, user_type } = req.body;
    
    // 验证必要字段
    if (!employee_id) {
      return res.status(400).json({
        success: false,
        message: '工号不能为空'
      });
    }
    
    console.log('准备创建用户，employee_id:', employee_id);

    // 检查用户是否已存在（通过工号或邮箱）
    const existingUser = await User.findOne({
      $or: [{ employee_id }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '工号或邮箱已存在'
      });
    }

    // 创建新用户（使用工号作为用户名）
    console.log('创建用户对象，employee_id:', employee_id, '类型:', typeof employee_id);
    const trimmedEmployeeId = String(employee_id).trim();
    console.log('处理后的工号:', trimmedEmployeeId, '长度:', trimmedEmployeeId.length);
    
    const user = new User({
      username: trimmedEmployeeId, // 使用工号作为用户名，确保去除空格
      email: String(email).trim().toLowerCase(),
      employee_id: trimmedEmployeeId,
      user_type: user_type || '非研发',
      password_hash: password // 会在 pre('save') 中自动加密
    });
    
    console.log('用户对象创建完成，username:', user.username, '类型:', typeof user.username);

    try {
      await user.save();
      console.log('用户保存成功');
    } catch (error) {
      // 处理 Mongoose 验证错误
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(e => e.message);
        return res.status(400).json({
          success: false,
          message: messages.join(', ')
        });
      }
      // 处理唯一性约束错误
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({
          success: false,
          message: `${field === 'username' ? '工号' : field === 'email' ? '邮箱' : field}已存在`
        });
      }
      throw error;
    }

    // 生成 token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          user_type: user.user_type,
          employee_id: user.employee_id
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// 用户登录
router.post('/login', [
  body('username').notEmpty().withMessage('用户名或邮箱不能为空'),
  body('password').notEmpty().withMessage('密码不能为空')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map(e => e.msg).join(', ')
      });
    }

    const { username, password } = req.body;

    // 查找用户（支持用户名或邮箱登录）
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 检查账户是否被锁定
    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: '账户已被锁定，请5分钟后再试'
      });
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      await user.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 登录成功，重置尝试次数并更新最后登录时间
    await user.resetLoginAttempts();
    user.last_login = Date.now();
    await user.save();

    // 生成 token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          user_type: user.user_type,
          employee_id: user.employee_id,
          last_login: user.last_login
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// 获取当前用户信息
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password_hash');
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          user_type: user.user_type,
          employee_id: user.employee_id,
          created_at: user.created_at,
          last_login: user.last_login
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// 修改密码
router.put('/password', authenticate, [
  body('oldPassword').notEmpty().withMessage('旧密码不能为空'),
  body('newPassword').isLength({ min: 6 }).withMessage('新密码至少6个字符'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('两次输入的新密码不一致');
    }
    return true;
  })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map(e => e.msg).join(', ')
      });
    }

    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // 验证旧密码
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: '旧密码错误'
      });
    }

    // 更新密码
    user.password_hash = newPassword; // 会在 pre('save') 中自动加密
    await user.save();

    res.json({
      success: true,
      message: '密码修改成功'
    });
  } catch (error) {
    next(error);
  }
});

// 管理员修改自己的邮箱
router.put('/profile', authenticate, [
  body('email').optional().isEmail().withMessage('请输入有效的邮箱地址').custom((value) => {
    if (value && !value.endsWith('@matridx.com')) {
      throw new Error('邮箱必须是公司邮箱（@matridx.com）');
    }
    return true;
  })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map(e => e.msg).join(', ')
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 更新邮箱（如果提供）
    if (req.body.email) {
      // 检查邮箱是否已被其他用户使用
      const existingUser = await User.findOne({ 
        email: req.body.email,
        _id: { $ne: user._id }
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '该邮箱已被使用'
        });
      }
      
      user.email = req.body.email;
    }

    await user.save();

    res.json({
      success: true,
      message: '个人信息更新成功',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          user_type: user.user_type,
          employee_id: user.employee_id
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

