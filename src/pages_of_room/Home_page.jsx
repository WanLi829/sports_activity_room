import React from 'react';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Home_page.css';
import { FaCalendarAlt, FaSearch, FaUserCog, FaClipboardList, FaRunning } from "react-icons/fa";

function Home_page() {
  const [search, setSearch] = useState("");
  const [activities, setActivities] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // 检查用户是否已经登录
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("loginUser") || "";
    setIsLoggedIn(!!token);
    setUserName(username);
  }, []);

  // 获取活动列表
  useEffect(() => {
    fetch("http://localhost:3001/api/activity")
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(error => {
        console.error("API请求失败:", error);
        alert("获取活动列表失败，请稍后重试！");
      });
  }, []);

  // 搜索过滤
  const filtered = activities.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    (a.desc && a.desc.toLowerCase().includes(search.toLowerCase()))
  );
    const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("image", file);
    
    try {
      const res = await fetch(`http://localhost:3001/api/activity/${id}/image`, {
        method: "POST",
        headers: {
          Authorization: token
        },
        body: formData
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setActivity({ ...activity, image: data.imageUrl });
        alert("图片上传成功！");
      } else {
        alert(data.message || "图片上传失败");
      }
    } catch (error) {
      console.error("图片上传失败:", error);
      alert("图片上传失败，请稍后重试");
    }
  };
  return (
    <div className="home-container">
      <div className="left-side">
        <div className="header">
          <div className="logo">
            <FaRunning className="logo-icon" />
            <h1 className="title">体育活动室</h1>
          </div>
          <div className="auth-buttons">
            {isLoggedIn ? (
              <>
                <span className="user-name">欢迎！ {userName}</span>
                <button 
                  className="button" 
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("loginUser");
                    window.location.reload();
                  }}
                >
                  退出登录
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="button">登录</Link>
                <Link to="/register" className="button">注册</Link>
              </>
            )}
          </div>
        </div>
        
        <div className="nav-container">
          <div className="nav-links">
            <Link to="/manage" className="nav-link">
              <FaUserCog className="nav-icon" />
              <span>活动管理</span>
            </Link>
            <Link to="/orders" className="nav-link">
              <FaClipboardList className="nav-icon" />
              <span>我的订单</span>
            </Link>
          </div>
        </div>
        
        <div className="search-container-wrapper">
          <div className="search-container">
            <h3 className="search-title"><FaSearch /> 搜索活动</h3>
            <input
              className="search-box"
              type="text"
              placeholder="输入活动名称或描述..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="right-side">
        <div className="activity-list-container">
          <h2 className="list-title">热门活动-报名中<FaRunning /></h2>
          <ul className="activity-list">
            {filtered.length > 0 ? (
              filtered.map(a => (
                <li className="activity-item" key={a.id || Math.random()}>
                  <Link to={`/activity/${a.id}`} className="activity-name">{a.name}</Link>
                  <p className="activity-desc">{a.desc?.substring(0, 80)}{a.desc && a.desc.length > 80 ? "..." : ""}</p>
                  <div className="activity-date">
                    <FaCalendarAlt />
                    <span>{a.date || "日期待定"}</span>
                  </div>
                </li>
              ))
            ) : (
              <div className="no-results">
                <h3>未找到匹配的活动！请重试！</h3>
                <h4>请您换个关键词进行搜索！</h4>
                <p>如果仍不行，请稍后再试哈哈哈！</p>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home_page;