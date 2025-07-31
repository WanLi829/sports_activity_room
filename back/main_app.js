const express = require('express');
const cors = require('cors');
const { sequelize } = require('./db'); 

const userRoutes = require('./routes/user');
const activityRoutes = require('./routes/activity');
const orderRoutes = require('./routes/order');
const commentRoutes = require('./routes/comment');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/comment', commentRoutes);

module.exports = { sequelize };

app.listen(3001, () => {
  console.log('后端服务已启动，端口3001');
});