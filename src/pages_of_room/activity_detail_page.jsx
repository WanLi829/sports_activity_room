import React from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaUser, 
  FaComment, 
  FaTrash, 
  FaCheck, 
  FaTimes,
  FaRunning,
  FaSpinner
} from "react-icons/fa";
import './activity_detail_page.css';

function Activity_detail_page() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("loginUser") || "游客";

  // 活动详情
  const [activity, setActivity] = useState(null);
  // 评论
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  // 报名
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // 获取活动详情
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/api/activity/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("获取活动详情失败");
        return res.json();
      })
      .then(data => {
        setActivity(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("获取活动详情失败:", error);
        setLoading(false);
      });
  }, [id]);

  // 获取评论
  const fetchComments = () => {
    fetch(`http://localhost:3001/api/comment/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("获取评论失败");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setComments(data);
        } else if (data && Array.isArray(data.comments)) {
          setComments(data.comments);
        } else {
          console.warn("评论数据格式不正确:", data);
          setComments([]);
        }
      })
      .catch(error => {
        console.error("获取评论失败:", error);
        setComments([]);
      });
  };

  // 初始化时获取评论
  useEffect(() => {
    fetchComments();
  }, [id]);

  // 获取报名状态
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    fetch("http://localhost:3001/api/order/my", {
      headers: { Authorization: token }
    })
      .then(res => {
        if (!res.ok) throw new Error("获取报名状态失败");
        return res.json();
      })
      .then(data => {
        const orders = Array.isArray(data) ? data : [];
        setIsSignedUp(orders.some(o => o.activityId == id));
      })
      .catch(error => {
        console.error("获取报名状态失败:", error);
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  // 报名
  const handleSignUp = async () => {
    if (!token) {
      alert("请先登录！");
      navigate("/login");
      return;
    }
    
    try {
      const res = await fetch("http://localhost:3001/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({
          activityId: id,
          activityName: activity?.name || "未命名活动",
          date: activity?.date || "未指定日期"
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "报名失败");
      }
      
      setIsSignedUp(true);
      alert("报名成功！");
    } catch (error) {
      console.error("报名失败:", error);
      alert(error.message || "报名失败，请稍后重试");
    }
  };

  // 取消报名
  const handleCancelSignUp = async () => {
    if (!token) {
      alert("请先登录！");
      return;
    }
    
    if (!window.confirm("确定要取消报名吗？")) return;
    
    try {
      const res = await fetch("http://localhost:3001/api/order/my", {
        headers: { Authorization: token }
      });
      
      if (!res.ok) throw new Error("获取订单失败");
      
      const orders = await res.json();
      const myOrder = Array.isArray(orders) 
        ? orders.find(o => o.activityId == id) 
        : null;
      
      if (!myOrder) {
        alert("未找到您的报名记录");
        return;
      }
      
      const delRes = await fetch(`http://localhost:3001/api/order/${myOrder.id}`, {
        method: "DELETE",
        headers: { Authorization: token }
      });
      
      if (delRes.ok) {
        setIsSignedUp(false);
        alert("已取消报名！");
      } else {
        const errorData = await delRes.json();
        throw new Error(errorData.message || "取消失败");
      }
    } catch (error) {
      console.error("取消失败:", error);
      alert(error.message || "取消失败，请稍后重试");
    }
  };

  // 添加评论
  const handleComment = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("请先登录！");
      return;
    }
    
    if (!content.trim()) {
      alert("请输入评论内容");
      return;
    }
    
    setCommentLoading(true);
    
    try {
      const res = await fetch("http://localhost:3001/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({
          activityId: id,
          content
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "评论失败");
      }
      
      // 重新获取评论列表以确保数据一致
      fetchComments();
      setContent("");
      alert("评论发表成功！");
    } catch (error) {
      console.error("评论失败:", error);
      alert(error.message || "评论失败，请稍后重试");
    } finally {
      setCommentLoading(false);
    }
  };
  
  // 删除评论
  const handleDeleteComment = async (commentId, commentUser) => {
    if (commentUser !== username) {
      alert("只能删除自己的评论！");
      return;
    }
    
    if (!window.confirm("确定要删除这条评论吗？")) return;
    
    setDeleteLoading(commentId);
    
    try {
      const res = await fetch(`http://localhost:3001/api/comment/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: token }
      });
      
      if (res.ok) {
        // 重新获取评论列表以确保数据一致
        fetchComments();
        alert("评论已成功删除！");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "删除失败");
      }
    } catch (error) {
      console.error("删除失败:", error);
      alert(error.message || "删除失败，请稍后重试");
    } finally {
      setDeleteLoading(null);
    }
  };

  // 格式化时间
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('zh-CN', options);
    } catch (e) {
      return "未知时间";
    }
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-container">
          <div className="loading-container">
            <FaSpinner className="spinner-icon" />
            <p>正在加载活动详情...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="detail-page">
        <div className="detail-container">
          <Link to="/" className="back-button">
            <FaArrowLeft /> 返回首页
          </Link>
          
          <div className="not-found">
            <FaRunning className="not-found-icon" />
            <h2 className="not-found-title">活动未找到</h2>
            <p className="not-found-text">
              抱歉，您访问的活动不存在或已被删除。请浏览其他体育活动。
            </p>
            <Link to="/" className="explore-link">
              <FaRunning /> 浏览活动
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const safeComments = Array.isArray(comments) ? comments : [];

  return (
    <div className="detail-page">
      <div className="detail-container">
        <Link to="/" className="back-button">
          <FaArrowLeft /> 返回首页
        </Link>
        
        {/* 活动详情卡片 */}
        <div className="activity-detail-card">
          <div className="activity-header">
            <h1 className="activity-title">{activity.name}</h1>
            <div className="activity-date">
              <FaCalendarAlt /> {activity.date || "日期待定"}
            </div>
          </div>
          
          <div className="activity-description">
            {activity.desc || "暂无活动描述..."}
          </div>
          
          {activity.image && (
            <div className="activity-image">
              <img src={activity.image} alt="活动图片" />
            </div>
          )}
          
          <div className="signup-section">
            {isSignedUp ? (
              <button 
                className="signup-button cancel-button"
                onClick={handleCancelSignUp}
              >
                <FaTimes /> 取消报名
              </button>
            ) : (
              <button 
                className="signup-button"
                onClick={handleSignUp}
              >
                <FaCheck /> 报名参加
              </button>
            )}
          </div>
        </div>
        <div className="comments-section">
          <h2 className="comments-title">
            <FaComment /> 活动评论区
          </h2>
          
          <form className="comment-form" onSubmit={handleComment}>
            <div className="comment-input-group">
              <textarea
                className="comment-input"
                placeholder="请写下您的评论吧！"
                value={content}
                onChange={e => setContent(e.target.value)}
                disabled={commentLoading}
              />
            </div>
            <button 
              className="comment-button" 
              type="submit"
              disabled={commentLoading || !content.trim()}
            >
              {commentLoading ? (
                <FaSpinner className="button-spinner" />
              ) : (
                "发表评论"
              )}
            </button>
          </form>
          
          <div className="comments-list">
            {safeComments.length === 0 ? (
              <div className="no-comments">
                该活动目前暂无评论！快来成为第一个评论者吧！
              </div>
            ) : (
              safeComments.map((c) => (
                <div className="comment-card" key={c.id || c.timestamp || Math.random()}>
                  <div className="comment-header">
                    <div className="comment-user">
                      <FaUser /> {c.user || "匿名用户"}
                    </div>
                    <div className="comment-time">
                      {c.time ? formatDate(c.time) : "刚刚"}
                    </div>
                  </div>
                  
                  <p className="comment-content">
                    {c.content}
                  </p>
                  
                  {c.user === username && (
                    <div className="comment-actions">
                      <button
                        className="delete-comment"
                        onClick={() => handleDeleteComment(c.id, c.user)}
                        disabled={deleteLoading === c.id}
                      >
                        {deleteLoading === c.id ? (
                          <FaSpinner className="button-spinner" />
                        ) : (
                          <>
                            <FaTrash /> 删除评论
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Activity_detail_page;