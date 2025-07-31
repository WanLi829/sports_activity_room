const { DataTypes } = require('sequelize');//定义数据库字段类型
const { sequelize } = require('../db'); 

const Activity = sequelize.define('Activity', {//定义activity模型
  name: {
    type: DataTypes.STRING,
    allowNull: false,//活动名称，不允许为空
  },
  desc: {//存储的是活动的描述
    type: DataTypes.TEXT, 
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  creator: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Activity;