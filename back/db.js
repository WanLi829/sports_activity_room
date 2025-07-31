const { Sequelize } = require('sequelize');

// 连接SQLite数据库
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false, // 关闭SQL日志
});

// 测试数据库是否连接成功
sequelize.authenticate()
  .then(() => {
    console.log('SQLite数据库连接成功!SQLite已启用!');
  })
  .catch(err => {
    console.error('SQLite数据库连接失败:请关闭或者删除文件后再运行:', err);
  });
// 同步所有模型到数据库（创建表）
sequelize.sync()
  .then(() => {
    console.log('数据库表结构已同步成功');
  })
  .catch(err => {
    console.error('数据库同步失败:请关闭或者删除数据库后再运行:', err);
  });

module.exports = { sequelize };