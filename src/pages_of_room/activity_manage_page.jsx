import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import React from 'react';
import { 
  FaArrowLeft, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaLock,
  FaSignInAlt,
  FaStar
} from "react-icons/fa";
import './activity_manage_page.css';

function ActivityManage_page() {
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({ name: "", desc: "", date: "", rating: 0 });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  
  // 检查用户登录状态
  const isLoggedIn = !!token;

  // 获取用户创建的活动
  useEffect(() => {
    if (!isLoggedIn) return;
    
    const savedActivities = localStorage.getItem('userActivities');
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
      setLoading(false);
    }
    
    setLoading(true);
    fetch("http://localhost:3001/api/activity/my-activities", {
      headers: {
        Authorization: token
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("获取活动失败！请重试！");
        return res.json();
      })
      .then(data => {
        setActivities(data);
        localStorage.setItem('userActivities', JSON.stringify(data));
        setLoading(false);
      })
      .catch((error) => {
        console.error("请重试！获取活动失败:", error);
        setLoading(false);
      });
  }, [token, isLoggedIn]);

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
  
  // 添加或编辑活动
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.date) return;
    
    try {
      if (editId) {
        
        const res = await fetch(`http://localhost:3001/api/activity/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
          body: JSON.stringify(form)
        });
        
        if (res.ok) {
          setActivities(acts =>
            acts.map(a => a.id === editId ? { ...a, ...form } : a)
          );
          setEditId(null);
          setForm({ name: "", desc: "", date: "", rating: 0 });
        } else {
          alert("您不是活动发起人！修改失败！");
        }
      } else {
      
        const res = await fetch("http://localhost:3001/api/activity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
          body: JSON.stringify(form)
        });
        
        const data = await res.json();
        if (res.ok) {
          setActivities(acts => [...acts, data]);
          setForm({ name: "", desc: "", date: "", rating: 0 });
        } else {
          alert(data.message || "添加失败");
        }
      }
    } catch (error) {
      console.error("操作失败:", error);
      alert("操作失败，请稍后重试");
    }
  };

  // 删除活动
  const handleDelete = async (id) => {
    if (!window.confirm("确定要删除这个活动吗？此操作不可撤销！请谨慎！")) return;
    
    try {
      const res = await fetch(`http://localhost:3001/api/activity/${id}`, {
        method: "DELETE",
        headers: { Authorization: token }
      });
      
      if (res.ok) {
        setActivities(acts => acts.filter(a => a.id !== id));
      } else {
        alert("您不是活动发起人!删除失败");
      }
    } catch (error) {
      console.error("删除失败:", error);
      alert("删除失败，请稍后重试");
    }
  };

  // 编辑活动
  const handleEdit = (activity) => {
    setForm({ 
      name: activity.name, 
      desc: activity.desc, 
      date: activity.date,
      rating: activity.rating || 0
    });
    setEditId(activity.id);
    document.querySelector('.manage-form-card').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="manage-page">
        <div className="manage-container">
          <div className="manage-header">
            <h1 className="manage-title">
              <FaLock className="title-icon" /> 活动管理
            </h1>
            <Link to="/" className="back-button">
              <FaArrowLeft className="button-icon" /> 返回首页
            </Link>
          </div>
          
          <div className="no-permission">
            <div className="permission-card">
              <FaLock className="no-permission-icon" />
              <h2 className="no-permission-title">目前无权限查看！</h2>
              <p className="no-permission-text">
                您尚未登录！请先登录后再查看活动管理界面！
              </p>
              <Link to="/login" className="login-link">
                <FaSignInAlt className="button-icon" /> 立即登录
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-page">
      <div className="manage-container">
        <div className="manage-header">
          <h1 className="manage-title">
            <FaClipboardList className="title-icon" /> 活动管理
          </h1>
          <Link to="/" className="back-button">
            <FaArrowLeft className="button-icon" /> 返回首页
          </Link>
        </div>
        
        <div className="manage-content">
          <div className="manage-form-card card">
            <h2 className="form-title">
              {editId ? <FaEdit className="title-icon" /> : <FaPlus className="title-icon" />}
              {editId ? "编辑活动" : "添加新活动"}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">活动名称</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="输入活动名称"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">活动描述</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="输入活动描述"
                  value={form.desc}
                  onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">活动日期</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-buttons">
                <button className="submit-button" type="submit">
                  {editId ? "保存修改" : "添加活动"}
                </button>
                
                {editId && (
                  <button 
                    className="cancel-button"
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      setForm({ name: "", desc: "", date: "", rating: 0 });
                    }}
                  >
                    取消编辑
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div className="manage-list-card card">
            <h2 className="list-title">
              <FaClipboardList className="title-icon" /> 我的活动列表
            </h2>
            
            <div className="activity-list">
              {loading ? (
                <div className="loading-placeholder">
                  <div className="spinner"></div>
                  <p>正在加载活动列表！请稍后！</p>
                </div>
              ) : activities.length === 0 ? (
                <div className="empty-placeholder">
                  <FaClipboardList className="empty-icon" />
                  <p className="empty-title">您还没有创建任何活动哟！</p>
                  <p className="empty-text">
                    添加属于您自己的第一个活动！
                  </p>
                </div>
              ) : (
                activities.map(a => (
                  <div className="activity-item card" key={a.id}>
                    <div className="activity-header">
                      <div className="activity-info">
                        <h3 className="activity-name">{a.name}</h3>
                        <div className="activity-date">
                          <FaCalendarAlt className="date-icon" /> {a.date || "日期待定"}
                        </div>
                      </div>
                      <div className="activity-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star} 
                            className={`star ${a.rating >= star ? 'active' : ''}`}
                            onClick={() => {
                              const updatedActivities = activities.map(act => 
                                act.id === a.id ? { ...act, rating: star } : act
                              );
                              setActivities(updatedActivities);
                              localStorage.setItem('userActivities', JSON.stringify(updatedActivities));
                            }}
                          >
                            <FaStar />
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {a.desc && (
                      <p className="activity-desc">
                        {a.desc.length > 120 
                          ? a.desc.substring(0, 120) + '...' 
                          : a.desc}
                      </p>
                    )}
                    
                    <div className="activity-actions">
                      <button 
                        className="action-button edit-button"
                        onClick={() => handleEdit(a)}
                      >
                        <FaEdit className="button-icon" /> 编辑
                      </button>
                      <button 
                        className="action-button delete-button"
                        onClick={() => handleDelete(a.id)}
                      >
                        <FaTrash className="button-icon" /> 删除
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityManage_page;