import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaSearch, FaBell } from "react-icons/fa";
import PropTypes from "prop-types";

const ProfessorHeader = ({ professorName = "Professor", toggleSidebar, notificationCount = 0 }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfile = () => {
    setIsDropdownOpen(false);
    navigate("/professor-settings");
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("tenantId");
    navigate("/");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    console.log("Search query:", e.target.value);
  };

  const handleNotificationClick = () => {
    navigate("/professor-notifications");
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <button
          type="button"
          className="hamburger-icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
        <span className="header-title">Student Management System</span>
      </div>

      <div className="header-center">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-bar"
            placeholder="Kërko..."
            value={searchQuery}
            onChange={handleSearch}
            aria-label="Search"
          />
        </div>
      </div>

      <div className="header-right">
        <button
          type="button"
          className="notification-bell"
          onClick={handleNotificationClick}
          aria-label={`Notifications, ${notificationCount} new`}
        >
          <FaBell />
          {notificationCount > 0 && (
            <span className="notification-badge">{notificationCount}</span>
          )}
        </button>

        <div className="user-info-container" ref={dropdownRef}>
          <button
            type="button"
            className="user-info"
            onClick={handleProfileClick}
            aria-expanded={isDropdownOpen}
            aria-label={`User menu for ${professorName}`}
          >
            <span className="user-logo">
              {professorName.charAt(0).toUpperCase()}
            </span>
            <span>
              {professorName}
            </span>
          </button>

          {isDropdownOpen && (
            <div className="user-dropdown bg-white border rounded-lg shadow-lg w-48 absolute right-0 mt-2">
              <ul className="py-2">
                <li
                  onClick={handleProfile}
                  className="px-4 py-2 text-gray-700 hover:bg-blue-100 cursor-pointer transition-colors duration-200"
                  role="menuitem"
                >
                  Profili
                </li>
                <li
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-700 hover:bg-blue-100 cursor-pointer transition-colors duration-200"
                  role="menuitem"
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

ProfessorHeader.propTypes = {
  professorName: PropTypes.string,
  toggleSidebar: PropTypes.func.isRequired,
  notificationCount: PropTypes.number,
};

export default ProfessorHeader;