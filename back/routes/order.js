const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); 
const { auth } = require('./user');

// 用户报名
router.post('/', auth, async (req, res) => {
  try {
    const { activityId, activityName, date } = req.body;
    const username = req.user.username;
    
    const exist = await Order.findOne({
      where: { username, activityId }
    });
    
    if (exist) return res.status(400).json({ message: '您已经报名此活动！' });
    
    await Order.create({ username, activityId, activityName, date });
    res.json({ message: '报名活动成功！' });
  } catch (error) {
    res.status(400).json({ error: '报名活动失败！' });
  }
});

// 取消报名
router.delete('/:id', auth, async (req, res) => {
  try {
    const username = req.user.username;
    const deletedRows = await Order.destroy({
      where: { 
        id: req.params.id, 
        username 
      }
    });
    
    if (deletedRows === 0) {
      return res.status(404).json({ message: '您没有报名过这个活动！' });
    }
    
    res.json({ message: '您已取消报名！' });
  } catch (error) {
    res.status(500).json({ error: '取消报名失败！' });
  }
});

// 获取当前用户所有报名
router.get('/my', auth, async (req, res) => {
  try {
    const username = req.user.username;
    const list = await Order.findAll({
      where: { username },
      order: [['date', 'DESC']] // 按日期降序排列
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: '获取报名列表失败！' });
  }
});

module.exports = router;