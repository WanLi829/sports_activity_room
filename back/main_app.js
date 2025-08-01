// 必须在文件最开头设置环境变量
process.env.NODE_ENV = process.pkg ? 'production' : process.env.NODE_ENV || 'development';

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { sequelize } = require('./db');

const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 安全获取静态文件路径
function getStaticDir() {
  // 开发环境路径
  if (!process.pkg) {
    const devPath = path.join(__dirname, '../dist');
    if (!fs.existsSync(devPath)) {
      console.error('开发环境前端资源缺失，请先执行 npm run build');
      process.exit(1);
    }
    return devPath;
  }

  // 生产环境路径处理（兼容pkg的resourcesPath问题）
  let resourcesPath;
  try {
    // 尝试获取资源路径（兼容不同pkg版本）
    resourcesPath = process.resourcesPath || 
                   path.dirname(process.execPath) || 
                   __dirname;
  } catch (err) {
    resourcesPath = __dirname;
  }

  // 可能的dist目录位置列表
  const possiblePaths = [
    path.join(resourcesPath, 'dist'),
    path.join(path.dirname(resourcesPath), 'dist'),
    path.join(__dirname, '../dist')
  ];

  // 检查存在的路径
  for (const staticPath of possiblePaths) {
    if (fs.existsSync(staticPath)) {
      console.log('使用静态文件目录:', staticPath);
      return staticPath;
    }
  }

  console.error('找不到前端资源目录，尝试过以下路径:', possiblePaths);
  process.exit(1);
}

const staticDir = getStaticDir();
console.log('静态文件目录:', staticDir);

// API路由
app.use('/api/user', require('./routes/user'));
app.use('/api/activity', require('./routes/activity'));
app.use('/api/order', require('./routes/order'));
app.use('/api/comment', require('./routes/comment'));

// 静态文件服务
app.use(express.static(staticDir));

// 前端路由回退
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('全局错误:', err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
  ==================================
  应用已启动!
  环境: ${process.env.NODE_ENV}
  端口: ${PORT}
  数据库: ${sequelize.config.storage}
  前端目录: ${staticDir}
  ==================================
  `);
});

module.exports = app;