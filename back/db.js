const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const os = require('os');

// 安全获取生产环境数据库路径
function getProductionDbPath() {
  console.log('当前运行环境信息:', {
  pkg: process.pkg,
  resourcesPath: process.resourcesPath,
  execPath: process.execPath,
  argv: process.argv
});
  const appDataDir = path.join(
    os.homedir(),
    process.platform === 'win32' ? 'AppData/Roaming' : '.config',
    'SportsActivityRoom'
  );

  // 确保目录存在
  if (!fs.existsSync(appDataDir)) {
    try {
      fs.mkdirSync(appDataDir, { recursive: true });
      console.log('创建用户数据目录:', appDataDir);
    } catch (err) {
      console.error('无法创建数据目录，将尝试临时目录:', err);
      return path.join(os.tmpdir(), 'sports_temp.db');
    }
  }

  return path.join(appDataDir, 'database.sqlite');
}

// 动态数据库路径配置
const dbPath = process.pkg ? getProductionDbPath() : path.resolve(__dirname, 'database.sqlite');

console.log('当前数据库路径:', dbPath);

// 初始化Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: msg => console.log(`[SQL] ${msg}`), // 开发环境日志
  retry: {
    max: 3, // 连接重试次数
  }
});

// 数据库连接测试
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 安全同步模型
    await sequelize.sync({ alter: true });
    console.log('数据库表结构已同步');
  } catch (err) {
    console.error('数据库初始化失败:', {
      error: err.message,
      path: dbPath,
      advice: '请检查写入权限或磁盘空间'
    });
    process.exit(1); // 致命错误退出
  }
}

testConnection();

module.exports = { sequelize };