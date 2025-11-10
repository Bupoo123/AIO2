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
  body('username').trim().isLength({ min: 3, max: 20 }).withMessage('用户名长度应在3-20个字符之间'),
  body('email').isEmail().withMessage('请输入有效的邮箱地址'),
  body('password').isLength({ min: 6 }).withMessage('密码至少6个字符'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('两次输入的密码不一致');
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

    const { username, email, password } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名或邮箱已存在'
      });
    }

    // 创建新用户
    const user = new User({
      username,
      email,
      password_hash: password // 会在 pre('save') 中自动加密
    });

    await user.save();

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
          role: user.role
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

module.exports = router;

