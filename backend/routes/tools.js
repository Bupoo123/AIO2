const express = require('express');
const { body, validationResult } = require('express-validator');
const Tool = require('../models/Tool');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

const isValidToolLink = (value) => {
  if (!value) return false;
  return /^https?:\/\//.test(value) || value.startsWith('/') || value.startsWith('./') || value.startsWith('../');
};

// 获取工具列表（根据权限过滤）
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const isAdmin = req.user.role === 'admin';
    const userType = req.user.user_type || '非研发';

    // 构建查询条件
    const query = {};
    
    // 权限过滤
    if (isAdmin) {
      // 管理员可以看到所有工具
      query.$or = [
        { access: 'all' },
        { access: 'admin' },
        { access: '研发' },
        { access: '非研发' }
      ];
    } else {
      // 普通用户根据用户类型过滤
      query.$or = [
        { access: 'all' },
        { access: userType }
      ];
    }

    // 分类过滤
    if (category) {
      query.category = category;
    }

    // 搜索过滤（工具名称或描述）
    if (search) {
      const searchQuery = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
      // 合并搜索条件和权限条件
      query.$and = [
        { $or: query.$or },
        searchQuery
      ];
      delete query.$or;
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
    const userType = req.user.user_type || '非研发';
    
    let query = {};
    if (!isAdmin) {
      query.$or = [
        { access: 'all' },
        { access: userType }
      ];
    }
    
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
    const isAdmin = req.user.role === 'admin';
    const userType = req.user.user_type || '非研发';
    
    if (!isAdmin) {
      if (tool.access === 'admin') {
        return res.status(403).json({
          success: false,
          message: '无权访问此工具'
        });
      }
      if (tool.access !== 'all' && tool.access !== userType) {
        return res.status(403).json({
          success: false,
          message: '无权访问此工具'
        });
      }
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
  body('url')
    .notEmpty().withMessage('工具链接不能为空')
    .custom((value) => {
      if (!isValidToolLink(value)) {
        throw new Error('请输入有效的链接（支持 http://、https:// 或 / 开头的相对路径）');
      }
      return true;
    }),
  body('version').optional().trim(),
  body('description').optional().trim(),
  body('icon').optional().trim(),
  body('logo').optional().trim(),
  body('access').optional().isIn(['all', 'admin', '研发', '非研发']).withMessage('访问权限只能是 all、admin、研发 或 非研发')
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
  body('url')
    .optional()
    .custom((value) => {
      if (value && !isValidToolLink(value)) {
        throw new Error('请输入有效的链接（支持 http://、https:// 或 / 开头的相对路径）');
      }
      return true;
    }),
  body('logo').optional().trim(),
  body('access').optional().isIn(['all', 'admin', '研发', '非研发']).withMessage('访问权限只能是 all、admin、研发 或 非研发')
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

