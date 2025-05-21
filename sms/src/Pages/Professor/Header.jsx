import React from 'react';
import { FaCalendarAlt, FaBell, FaSearch } from 'react-icons/fa';

function Header() {
  return (
    <div className="header">
      <div className="header-left">
        <h3>Mirëdita, Professor Smith</h3>
        <h1>Professor Dashboard</h1>
        <p>Menaxhoni kurset dhe studentët tuaj</p>
      </div>

      
      <div className="header-right">
        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Kërko..." />
        </div>

        <div className="notification-icon">
          <FaBell />
          <span className="notif-dot"></span>
        </div>

        <div className="profile">
          <span className="profile-name">Professor</span>
          <span className="profile-role">PROFESSOR</span>
        </div>
      </div>
    </div>
  );
}

export default Header;
