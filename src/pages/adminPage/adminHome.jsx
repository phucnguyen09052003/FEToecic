import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useUser } from '../../hooks/UserContext'; // Import hook để sử dụng UserContext
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AdminHome = () => {
  const { user, logout } = useUser(); // Lấy thông tin người dùng từ UserContext
  const navigate = useNavigate(); // Hook để điều hướng




  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  const styles = {
    adminContainer: {
      display: 'flex',
      height: '100%',
    },
    sidebar: {
      width: '250px',
      backgroundColor: '#1E40AF', // Màu xanh lam giống như trang chủ
      color: 'white',
      padding: '20px',
      height: '100%',
      boxSizing: 'border-box',
    },
    sidebarTitle: {
      textAlign: 'center',
      fontSize: '24px',
      marginBottom: '30px',
      color: '#ffffff', // Chữ màu trắng
    },
    sidebarList: {
      listStyle: 'none',
      padding: '0',
    },
    sidebarListItem: {
      margin: '20px 0',
    },
    sidebarLink: {
      color: 'white',
      textDecoration: 'none',
      fontSize: '18px',
      display: 'block',
      padding: '10px',
      transition: 'background-color 0.3s',
    },
    sidebarLinkHover: {
      backgroundColor: '#3B82F6', // Màu xanh sáng khi hover
    },
    mainContent: {
      flex: '1',
      padding: '20px',
      backgroundColor: '#F3F4F6', // Nền sáng để làm nổi bật nội dung
    },
    mainContentHeader: {
      fontSize: '36px',
      marginBottom: '20px',
      color: '#1E40AF', // Màu tiêu đề chính như trong sidebar
    },
    mainContentText: {
      fontSize: '18px',
      color: '#4B5563', // Màu chữ nhạt cho dễ đọc
    }

  };

  return (
    <div style={styles.adminContainer}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <h2 style={styles.sidebarTitle}>Toeic Master</h2>
        <h2 style={styles.sidebarTitle}>Trang Quản Trị</h2>
        <ul style={styles.sidebarList}>
          <li style={styles.sidebarListItem}>
            <p className="text-xl bg-yellow-600 text-left p-2 rounded-t-md">
              Xin chào
            </p>
            <div className="text-xl text-right bg-yellow-600 p-2 rounded-b-md">
              <strong>{user.fullName}</strong>
            </div>
          </li>
          <li style={styles.sidebarListItem}>
            <Link to="/admin/adminInfo" style={styles.sidebarLink}>Thông tin quản trị viên</Link>
          </li>
          <li style={styles.sidebarListItem}>
            <Link to="/admin/topics" style={styles.sidebarLink}>Quản lý chủ đề</Link>
          </li>
          <li style={styles.sidebarListItem}>
            <Link to="/admin/vocabulary" style={styles.sidebarLink}>Quản lý từ vựng</Link>
          </li>
          <li style={styles.sidebarListItem}>
            <Link to="/admin/part" style={styles.sidebarLink}>Quản lý các part</Link>
          </li>
          <li style={styles.sidebarListItem}>
            <Link to="/admin/lesson" style={styles.sidebarLink}>Quản lý bài học</Link>
          </li>
          <li style={styles.sidebarListItem}>
            <Link to="/admin/question" style={styles.sidebarLink}>Quản lý câu hỏi</Link>
          </li>
          <li style={styles.sidebarListItem}>
            <Link to="/admin/group" style={styles.sidebarLink}>Quản lý nhóm câu hỏi</Link>
          </li>
          <li style={styles.sidebarListItem}>
            <Link to="/admin/account" style={styles.sidebarLink}>Quản lý tài khoản</Link>
          </li>
          <li style={styles.sidebarListItem}>
            <Link to="/admin/exams" style={styles.sidebarLink}>Tạo đề thi</Link>
          </li>
          <li style={styles.sidebarListItem}>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-orange-700 rounded-2xl"
            >
              Đăng xuất
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Nội dung các route con sẽ được hiển thị ở đây */}
        <Outlet />
      </div>
    </div>
  );
}

export default AdminHome;
