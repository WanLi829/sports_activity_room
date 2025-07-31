import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import React from 'react';
import { FaUser, FaLock, FaArrowLeft, FaCheck, FaInfoCircle } from "react-icons/fa";
import './Register_page.css';

function Register_page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    
    // 客户端验证
    if (password !== confirmPassword) {
      setMsg("两次输入的密码不一致");
      return;
    }
    
    try {
      const res = await fetch("http://localhost:3001/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMsg("注册成功！请登录！");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMsg(data.message || "注册失败，请稍后再试！");
      }
    } catch (error) {
      console.error("注册请求失败:", error);
      setMsg("网络错误: " + error.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <Link to="/" className="back-home">
          <FaArrowLeft /> 返回首页
        </Link>
        
        <div className="register-card">
          <div className="register-header">
            <h1 className="register-title">用户注册</h1>
            <p className="register-subtitle">立即创建您的体育活动室账号！</p>
          </div>
          
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-icon">
                <FaUser />
              </span>
              <input
                className="register-input"
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
                className="register-input"
                type="password"
                placeholder="密码"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <span className="input-icon">
                <FaLock />
              </span>
              <input
                className="register-input"
                type="password"
                placeholder="确认密码"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>    
            <button className="register-button" type="submit">注册</button>
            
            <div className={`message ${msg.includes("成功") ? "success" : "error"}`}>
              {msg}
            </div>
          </form>
          
          <div className="login-link">
            已有帐号？立即登录！<Link to="/login">登录点击这里！</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register_page;