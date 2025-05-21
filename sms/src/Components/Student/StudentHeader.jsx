import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaSearch } from "react-icons/fa";

const StudentHeader = ({ studentName, toggleSidebar }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfile = () => {
    setIsDropdownOpen(false);
    navigate('/student-settings'); // ndryshuar nga /admin-settings
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    localStorage.removeItem('token');
    localStorage.removeItem('tenantId');
    navigate('/'); // logout
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
            <span className="user-logo">{studentName.charAt(0).toUpperCase()}</span>
            {studentName} STUDENT
          </span>
          {isDropdownOpen && (
            <div className="user-dropdown bg-white border rounded-lg shadow-lg w-48 absolute right-0 mt-2">
              <ul className="py-2">
                <li
                  onClick={handleProfile}
                  className="px-4 py-2 text-gray-700 hover:bg-blue-100 cursor-pointer transition-colors duration-200"
                >
                  Profili
                </li>
                <li
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-700 hover:bg-blue-100 cursor-pointer transition-colors duration-200"
                >
                  Dil
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
