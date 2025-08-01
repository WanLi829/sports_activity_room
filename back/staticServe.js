import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function staticServe(app) {
  // 提供前端静态文件
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // 处理前端路由
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}