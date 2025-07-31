import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import React from 'react';
import { FaUser, FaLock, FaArrowLeft, FaHome } from "react-icons/fa";
import './Login_page.css';

function Login_page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("http://localhost:3001/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // 登录成功
        localStorage.setItem("token", data.token);
        localStorage.setItem("loginUser", username);
        setMsg("登录成功！");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMsg(data.message || "用户名或密码错误！请重试！");
      }
    } catch {
      setMsg("网络错误");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Link to="/" className="back-home">
          <FaArrowLeft /> 返回首页
        </Link>
        
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">用户登录</h1>
            <p className="login-subtitle">请输入用户名和密码</p>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-icon">
                <FaUser />
              </span>
              <input
                className="login-input"
                type="text"
                placeholder="用户名"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <span className="input-icon">
                <FaLock />
              </span>
              <input
                className="login-input"
                type="password"
                placeholder="密码"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button className="login-button" type="submit">点击登录</button>
            
            <div className={`message ${msg.includes("成功") ? "success" : "error"}`}>
              {msg}
            </div>
          </form>
          
          <div className="register-link">
            还没有账号？<Link to="/register">立即注册</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login_page;