const express = require('express');
const User = require('../models/User');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// 获取所有用户列表（仅管理员）
router.get('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password_hash -__v')
      .sort({ created_at: -1 });

    res.json({
      success: true,
      data: {
        users,
        count: users.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// 获取单个用户信息（仅管理员）
router.get('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password_hash -__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// 更新用户角色（仅管理员）
router.put('/:id/role', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: '角色只能是 user 或 admin'
      });
    }

    // 不能修改自己的角色
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: '不能修改自己的角色'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password_hash -__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      message: '用户角色更新成功',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// 重置用户登录尝试次数（仅管理员）
router.put('/:id/reset-login', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: { login_attempts: 0 },
        $unset: { lock_until: 1 }
      },
      { new: true }
    ).select('-password_hash -__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      message: '登录尝试次数已重置',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// 删除用户（仅管理员）
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    // 不能删除自己
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: '不能删除自己的账号'
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      message: '用户删除成功'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

