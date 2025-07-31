const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');//导入了User模型

const JWT_SECRET = 'jwt_secret';//这是用来加密登陆信息的密钥

// 注册的代码实现
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 检查用户名是否已经存在（因为不可以有两个相同的个用户名）
    const exist = await User.findOne({ where: { username } });
    if (exist) return res.status(400).json({ message: '用户名已存在，请重新注册！' });
  
    const hash = await bcrypt.hash(password, 10);
    
    await User.create({ username, password: hash });
    
    res.json({ message: '注册成功！' });
  } catch (error) {
    res.status(400).json({ error: '注册失败' });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ where: { username } });
    if (!user){

     return res.status(400).json({ message: '用户名不存在，请重新输入或注册新用户名！' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: '密码错误！请重新输入！' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET
    );
    
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: '登录失败' });
  }
});

// 检查用户是否登陆的中间件
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: '请先登录！' });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: '无效' });
  }
}

module.exports = router;
module.exports.auth = auth; 