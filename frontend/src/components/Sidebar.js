import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ navItems }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="logo">🌾</span>
        <h2>Crop Advisory System</h2>
        <p>Agricultural Extension</p>
      </div>

      <div className="sidebar-user">
        <div className="user-name">👤 {user?.fullName}</div>
        <div className="user-role">
          {user?.role === 'farmer' ? '🧑‍🌾 Farmer' : '👨‍💼 Extension Officer'}
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {/* Dark / Light mode toggle */}
        <button className="nav-item theme-toggle" onClick={toggleTheme}>
          <span className="nav-icon">{isDark ? '☀️' : '🌙'}</span>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>

        <button className="nav-item" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
