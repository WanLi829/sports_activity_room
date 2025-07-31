const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity'); 
const { auth } = require('./user');

// 获取所有活动
router.get('/', async (req, res) => {
  try {
    const list = await Activity.findAll();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: '出现错误！获取活动列表失败！' });
  }
});

// 新建活动（需登录）
router.post('/', auth, async (req, res) => {//auth确保了只有认证用户才能访问新建活动。
  try {
    const { name, desc, date } = req.body;
    const creator = req.user.username;
    const activity = await Activity.create({ name, desc, date, creator });
    res.json(activity);
  } catch (error) {
    res.status(400).json({ error: '创建活动失败！' });
  }
});

// 编辑活动（需登录且为发起人）
router.put('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id); 
    if (!activity) return res.status(404).json({ message: '这个活动不存在！' });
    
    if (activity.creator !== req.user.username) {
      return res.status(403).json({ message: '您不是活动发起人！暂时没有权限编辑活动！' });
    }
    
    await activity.update(req.body); // 使用 update 方法替代手动赋值和保存
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: '更新活动失败！请重试！' });
  }
});

// 删除活动（需登录且为发起人）
router.delete('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id); 
    if (!activity) return res.status(404).json({ message: '这个活动不存在！' });
    
    if (activity.creator !== req.user.username) {
      return res.status(403).json({ message: '您不是活动发起人！暂时没有权限删除活动！' });
    }
    
    await activity.destroy(); // 使用 destroy 方法，而不是remove
    res.json({ message: '删除活动成功' });
  } catch (error) {
    res.status(500).json({ error: '删除活动失败' });
  }
});

// 获取单个活动详情
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id); 
    if (!activity) return res.status(404).json({ message: '您查找的活动不存在！' });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: '获取活动详情失败' });
  }
});

module.exports = router;