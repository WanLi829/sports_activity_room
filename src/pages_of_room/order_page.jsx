import React from 'react';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaTicketAlt, FaCalendarAlt, FaUser, FaRunning, FaSearch, FaSadTear, FaSignInAlt } from "react-icons/fa";
import './order_page.css';

function Order_page() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    fetch("http://localhost:3001/api/order/my", {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("获取订单失败:", error);
        setLoading(false);
      });
  }, [token]);
  // 生成随机订单ID
  const generateOrderId = () => {
    return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  };
  // 取消订单
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("您确定要取消此次报名吗？")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/api/order/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: token }
      });

      if (res.ok) {
        alert("报名已成功取消！如果想继续参加可重新报名！");
        setOrders(orders.filter(order => order.id !== orderId));
      } else {
        alert("取消报名失败！");
      }
    } catch (error) {
      console.error("取消报名时出错:", error);
      alert("取消报名时出错！");
    }
  };

  return (
    <div className="order-page">
      <div className="order-container">
        <div className="order-header">
          <h1 className="order-title">
            <FaTicketAlt /> 我的报名订单
          </h1>
          <Link to="/" className="back-button">
            <FaArrowLeft /> 返回首页
          </Link>
        </div>
        
        {!token ? (
          <div className="login-prompt">
            <FaSadTear className="login-prompt-icon" />
            <h2 className="login-prompt-title">您尚未登录！</h2>
            <p className="login-prompt-text">
              登录后即可查看您的活动报名订单！如果您还没有账号，请注册账号！
            </p>
            <div>
              <Link to="/login" className="login-button">
                <FaSignInAlt /> 立即登录
              </Link>
            </div>
             <div>
              <Link to="/Register" className="login-button">
                <FaSignInAlt /> 立即注册
              </Link>
            </div>
          </div>
        ) : loading ? (
          <div className="no-orders">
            <div className="loading-spinner"></div>
            <p>请稍等！正在加载！loading...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <FaSearch className="no-orders-icon" />
            <h2 className="no-orders-title">当前您暂时没有报名活动！</h2>
            <p className="no-orders-text">
              您目前还没有报名任何活动。您可以去浏览活动列表，选择您感兴趣的活动进行报名！
            </p>
            <Link to="/" className="explore-link">
              <FaRunning /> 去浏览活动
            </Link>
          </div>
        ) : (
          <ul className="order-list">
            {orders.map((o, idx) => (
              <li className="order-card" key={o.id ? o.id : idx}>
                <h3 className="order-activity">{o.activityName || `体育活动 #${idx + 1}`}</h3>
                
                <div className="order-info">
                  <div className="order-detail">
                    <span className="detail-label">订单号:</span>
                    <span className="detail-value">{generateOrderId()}</span>
                  </div>
                  <div className="order-detail">
                    <span className="detail-label">报名日期:</span>
                    <span className="detail-value">{new Date().toLocaleString()}</span>
                  </div>
                  <div className="order-detail">
                    <span className="detail-label">活动日期:</span>
                    <span className="order-date">
                      <FaCalendarAlt /> {o.date || "日期待定"}
                    </span>
                  </div>
                </div>
                
                <div className="order-actions">
                  <div className="action-button view-details"><Link to={`/activity/${o.activityId}`}>查看详情</Link></div>
                  <div className="action-button cancel-order" onClick={() => handleCancelOrder(o.id)}>取消报名</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Order_page;