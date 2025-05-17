import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBook, FaFileAlt, FaClock, FaCalendarCheck, FaClipboard,
  FaGraduationCap, FaQuestionCircle, FaCog, FaSignOutAlt
} from "react-icons/fa";

const StudentSidebar = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const STORAGE_KEY = "studentSidebarScroll";

  const handleItemClick = (path) => {
    if (menuRef.current) {
      sessionStorage.setItem(STORAGE_KEY, menuRef.current.scrollTop);
    }
    navigate(path);
  };

  useEffect(() => {
    const savedScroll = sessionStorage.getItem(STORAGE_KEY);
    if (menuRef.current && savedScroll !== null) {
      menuRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, [location.pathname]);

  return (
    <div className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="admin-sidebar-header">
        <div className="icon">📘</div>
        <span>{isSidebarOpen ? "SMS 2025/26" : "SMS"}</span>
      </div>
      <ul className="admin-sidebar-menu" ref={menuRef}>
        <li onClick={() => handleItemClick("/StudentDashboard")} className="menu-item">
          <FaClock className="menu-icon" />
          {isSidebarOpen && <span>Dashboard</span>}
        </li>
        <li onClick={() => handleItemClick("/student-courses")} className="menu-item">
          <FaBook className="menu-icon" />
          {isSidebarOpen && <span>Kurset</span>}
        </li>
        <li onClick={() => handleItemClick("/student-materials")} className="menu-item">
          <FaFileAlt className="menu-icon" />
          {isSidebarOpen && <span>Materialet</span>}
        </li>
        <li onClick={() => handleItemClick("/student-schedule")} className="menu-item">
          <FaClock className="menu-icon" />
          {isSidebarOpen && <span>Orari</span>}
        </li>
        <li onClick={() => handleItemClick("/student-exams")} className="menu-item">
          <FaClipboard className="menu-icon" />
          {isSidebarOpen && <span>Provimet</span>}
        </li>
        <li onClick={() => handleItemClick("/student-grades")} className="menu-item">
          <FaGraduationCap className="menu-icon" />
          {isSidebarOpen && <span>Notat</span>}
        </li>
        <li onClick={() => handleItemClick("/student-scholarships")} className="menu-item">
          <FaGraduationCap className="menu-icon" />
          {isSidebarOpen && <span>Bursat</span>}
        </li>
        <li onClick={() => handleItemClick("/student-faq")} className="menu-item">
          <FaQuestionCircle className="menu-icon" />
          {isSidebarOpen && <span>FAQ</span>}
        </li>
        <li onClick={() => handleItemClick("/student-settings")} className="menu-item">
          <FaCog className="menu-icon" />
          {isSidebarOpen && <span>Cilësimet</span>}
        </li>
        <li onClick={() => handleItemClick("/")} className="menu-item">
          <FaSignOutAlt className="menu-icon" />
          {isSidebarOpen && <span>Logout</span>}
        </li>
      </ul>
      <div className="admin-sidebar-user">
        <div className="sidebar-user-logo">SJ</div>
        {isSidebarOpen && (
          <div className="admin-sidebar-user-text">
            <div>Student Johnson</div>
            <div>STUDENT</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSidebar;
