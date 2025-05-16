import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaSearch } from "react-icons/fa";

const Header = ({ adminName, toggleSidebar }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    localStorage.removeItem('token');
    localStorage.removeItem('tenantId');
    navigate('/');
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <FaBars className="hamburger-icon" onClick={toggleSidebar} />
        <span className="header-title">Student Management System</span>
      </div>
      <div className="header-center">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input type="text" className="search-bar" placeholder="Kërko..." />
        </div>
      </div>
      <div className="header-right">
        <span className="notification-bell">
          🔔<span className="notification-badge">3</span>
        </span>
        <div className="user-info-container">
          <span className="user-info" onClick={handleProfileClick}>
            <span className="user-logo">{adminName.charAt(0).toUpperCase()}</span>
            {adminName} ADMIN
          </span>
          {isDropdownOpen && (
            <div className="user-dropdown">
              <ul>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;