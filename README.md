# web开发暑校大作业：体育活动室
## Github链接
    https://github.com/WanLi829/sports_activity_room.git
## 打包平台
    Windows
## 技术栈
- **前端**: React.js, Vite, React Router, React Icons
- **样式**: CSS, Sass
- **状态管理**: React Hooks
- **后端**: Node.js, Express 
- **数据库**: SQLite
- **构建工具**: Vite

## 项目结构
```
sports_activity_room/
├── src/
│   ├── App.jsx                # 应用入口
│   ├── main.jsx               # 主渲染文件
│   ├── pages_of_room/         # 页面组件
│   │   ├── Home_page.jsx      # 首页
│   │   ├── Login_page.jsx     # 登录页
│   │   ├── Register_page.jsx  # 注册页
│   │   ├── activity_detail_page.jsx  # 活动详情页
│   │   ├── activity_manage_page.jsx  # 活动管理页
│   │   └── order_page.jsx    # 订单页
│   ├── assets/               # 静态资源
│   └── styles/               # 全局样式
├── back/                     # 后端代码（待完善）
├── public/                   # 公共资源
└── README.md                 # 项目说明
```

## 功能模块
1. **用户模块**: 注册、登录、个人信息管理
2. **活动模块**: 活动浏览、详情查看、报名、取消报名
3. **评论模块**: 用户评论互动
4. **管理模块**: 活动管理

## 运行项目
1. 安装依赖: `npm install`
2. 启动开发服务器: `npm run dev`
3. 构建生产版本: `npm run build`
## 项目简介
本项目是一个体育活动室，可以帮助用户浏览、报名和管理各类体育活动。系统提供了注册、登录、活动管理、订单管理、活动搜索、活动报名、活动详情、活动评论等功能。
