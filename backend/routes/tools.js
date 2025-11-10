const express = require('express');
const { body, validationResult } = require('express-validator');
const Tool = require('../models/Tool');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// 获取工具列表（根据权限过滤）
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const isAdmin = req.user.role === 'admin';

    // 构建查询条件
    const query = {};
    
    // 权限过滤：普通用户只能看到 access='all' 的工具
    if (!isAdmin) {
      query.access = 'all';
    }

    // 分类过滤
    if (category) {
      query.category = category;
    }

    // 搜索过滤（工具名称或描述）
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tools = await Tool.find(query).sort({ created_at: -1 });

    res.json({
      success: true,
      data: {
        tools,
        count: tools.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// 获取工具分类列表
router.get('/categories', authenticate, async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const query = isAdmin ? {} : { access: 'all' };
    
    const categories = await Tool.distinct('category', query);
    
    res.json({
      success: true,
      data: {
        categories
      }
    });
  } catch (error) {
    next(error);
  }
});

// 获取单个工具详情
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const tool = await Tool.findById(req.params.id);
    
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: '工具不存在'
      });
    }

    // 权限检查
    if (tool.access === 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权访问此工具'
      });
    }

    res.json({
      success: true,
      data: { tool }
    });
  } catch (error) {
    next(error);
  }
});

// 创建工具（仅管理员）
router.post('/', authenticate, requireAdmin, [
  body('name').notEmpty().withMessage('工具名称不能为空'),
  body('category').notEmpty().withMessage('工具分类不能为空'),
  body('github_url').isURL().withMessage('请输入有效的GitHub链接'),
  body('version').optional().trim(),
  body('description').optional().trim(),
  body('icon').optional().trim(),
  body('access').optional().isIn(['all', 'admin']).withMessage('访问权限只能是 all 或 admin')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map(e => e.msg).join(', ')
      });
    }

    const tool = new Tool(req.body);
    await tool.save();

    res.status(201).json({
      success: true,
      message: '工具创建成功',
      data: { tool }
    });
  } catch (error) {
    next(error);
  }
});

// 更新工具（仅管理员）
router.put('/:id', authenticate, requireAdmin, [
  body('name').optional().notEmpty().withMessage('工具名称不能为空'),
  body('category').optional().notEmpty().withMessage('工具分类不能为空'),
  body('github_url').optional().isURL().withMessage('请输入有效的GitHub链接'),
  body('access').optional().isIn(['all', 'admin']).withMessage('访问权限只能是 all 或 admin')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map(e => e.msg).join(', ')
      });
    }

    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: Date.now() },
      { new: true, runValidators: true }
    );

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: '工具不存在'
      });
    }

    res.json({
      success: true,
      message: '工具更新成功',
      data: { tool }
    });
  } catch (error) {
    next(error);
  }
});

// 删除工具（仅管理员）
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const tool = await Tool.findByIdAndDelete(req.params.id);

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: '工具不存在'
      });
    }

    res.json({
      success: true,
      message: '工具删除成功'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

