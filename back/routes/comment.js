const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment'); 
const { auth } = require('./user');

// 获取某活动所有评论
router.get('/:activityId', async (req, res) => {
  try {
    const list = await Comment.findAll({
      where: { activityId: req.params.activityId },
      order: [['time', 'ASC']] // 按时间升序排列，看起来更加有序
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: '获取评论列表失败！请重试！' });
  }
});

// 添加评论
router.post('/', auth, async (req, res) => {
  try {
    const { activityId, content, rating } = req.body;
    const user = req.user.username;
    const time = new Date().toLocaleString();
    const comment = await Comment.create({ activityId, user, content, time, rating });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: '评论失败！请重试！' });
  }
});

// 删除评论（仅本人）
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ message: '该评论不存在！请重试！' });
    
    if (comment.user !== req.user.username) {
      return res.status(403).json({ message: '你只能够删除自己的评论！' });
    }
    
    await comment.destroy();
    res.json({ message: '删除评论成功！' });
  } catch (error) {
    res.status(500).json({ error: '删除评论失败！' });
  }
});

module.exports = router;