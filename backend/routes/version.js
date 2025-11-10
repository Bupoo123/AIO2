const express = require('express');
const Version = require('../models/Version');
const Tool = require('../models/Tool');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

// 检查工具版本更新
router.get('/check', authenticate, async (req, res, next) => {
  try {
    const { toolId } = req.query;

    if (toolId) {
      // 检查单个工具的版本
      const tool = await Tool.findById(toolId);
      if (!tool) {
        return res.status(404).json({
          success: false,
          message: '工具不存在'
        });
      }

      const latestVersion = await Version.findOne({ tool_id: toolId })
        .sort({ released_at: -1 });

      if (!latestVersion) {
        return res.json({
          success: true,
          data: {
            tool_id: toolId,
            current_version: tool.version,
            latest_version: tool.version,
            has_update: false
          }
        });
      }

      const hasUpdate = Version.compareVersions(latestVersion.version, tool.version) > 0;

      return res.json({
        success: true,
        data: {
          tool_id: toolId,
          current_version: tool.version,
          latest_version: latestVersion.version,
          has_update: hasUpdate,
          changelog: latestVersion.changelog,
          released_at: latestVersion.released_at
        }
      });
    }

    // 检查所有工具的版本
    const tools = await Tool.find();
    const updates = [];

    for (const tool of tools) {
      const latestVersion = await Version.findOne({ tool_id: tool._id })
        .sort({ released_at: -1 });

      if (latestVersion) {
        const hasUpdate = Version.compareVersions(latestVersion.version, tool.version) > 0;
        if (hasUpdate) {
          updates.push({
            tool_id: tool._id,
            tool_name: tool.name,
            current_version: tool.version,
            latest_version: latestVersion.version,
            changelog: latestVersion.changelog,
            released_at: latestVersion.released_at
          });
        }
      }
    }

    res.json({
      success: true,
      data: {
        updates,
        count: updates.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// 获取工具的版本历史
router.get('/history/:toolId', authenticate, async (req, res, next) => {
  try {
    const versions = await Version.find({ tool_id: req.params.toolId })
      .sort({ released_at: -1 });

    res.json({
      success: true,
      data: {
        versions
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

