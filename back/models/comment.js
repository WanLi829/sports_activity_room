const { DataTypes } = require('sequelize');
const { sequelize } = require('../db'); 
const Activity = require('./Activity'); 

const Comment = sequelize.define('Comment', {
  activityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Activity, 
      key: 'id'       
    },
    onDelete: 'CASCADE' //activity一旦被删除，评论也会被删除
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  time: {
    type: DataTypes.DATE, 
    allowNull: false,
    defaultValue: DataTypes.NOW, // 默认值为当前时间
  },
});

// 定义与 Activity 的关联关系
Comment.belongsTo(Activity, { foreignKey: 'activityId' });

module.exports = Comment;