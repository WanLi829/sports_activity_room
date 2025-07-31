const { DataTypes } = require('sequelize');
const { sequelize } = require('../db'); 
const Activity = require('./Activity');

const Order = sequelize.define('Order', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  activityId: {
    type: DataTypes.INTEGER, // SQLite 中使用 INTEGER 作为外键
    allowNull: false,
    references: {
      model: Activity,
      key: 'id', 
    },
    onDelete: 'CASCADE', //activity一旦被删除，报名也会被删除
  },
  activityName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
});
// 定义与 Activity 模型的关联
Order.belongsTo(Activity, { foreignKey: 'activityId' });

module.exports = Order;