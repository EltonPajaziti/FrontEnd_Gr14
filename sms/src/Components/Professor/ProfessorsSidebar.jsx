import React, { useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaBookOpen,
  FaFileAlt,
  FaClipboardList,
  FaCalendarAlt,
  FaClipboardCheck,
  FaPen,
  FaQuestionCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import PropTypes from "prop-types";

const ProfessorSidebar = ({ professorName = "Professor", isSidebarOpen = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const STORAGE_KEY = "professorSidebarScroll";

  const handleItemClick = useCallback((path) => {
    if (menuRef.current) {
      sessionStorage.setItem(STORAGE_KEY, menuRef.current.scrollTop);
    }
    if (path === "/") {
      localStorage.removeItem("token");
      localStorage.removeItem("tenantId");
    }
    navigate(path);
  }, [navigate]);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem(STORAGE_KEY);
    if (menuRef.current && savedScroll !== null && isSidebarOpen) {
      const scrollValue = parseInt(savedScroll, 10);
      if (!isNaN(scrollValue)) {
        menuRef.current.scrollTop = scrollValue;
      }
    }
  }, [location.pathname, isSidebarOpen]);

  return (
    <nav className="professor-sidebar" role="navigation" aria-label="Professor Navigation">
      <div className="professor-sidebar-header">
        <div className="text-2xl">🎓</div>
        {isSidebarOpen && <span>SMS 2025/26</span>}
      </div>
      <ul className="professor-sidebar-menu" ref={menuRef}>
        <li
          className={`menu-item ${location.pathname === "/professor-dashboard" ? "bg-gray-700" : ""}`}
          onClick={() => handleItemClick("/professor-dashboard")}
          role="menuitem"
          aria-label="Dashboard"
        >
          <FaTachometerAlt className="menu-icon" />
          {isSidebarOpen && <span>Dashboard</span>}
        </li>
        <li
          className={`menu-item ${location.pathname === "/professor-students" ? "bg-gray-700" : ""}`}
          onClick={() => handleItemClick("/professor-students")}
          role="menuitem"
          aria-label="Studentët"
        >
          <FaUserGraduate className="menu-icon" />
          {isSidebarOpen && <span>Studentët</span>}
        </li>
        <li
          className={`menu-item ${location.pathname === "/professor-courses" ? "bg-gray-700" : ""}`}
          onClick={() => handleItemClick("/professor-courses")}
          role="menuitem"
          aria-label="Kurset"
        >
          <FaBookOpen className="menu-icon" />
          {isSidebarOpen && <span>Kurset</span>}
        </li>
        <li
          className={`menu-item ${location.pathname === "/professor-materials" ? "bg-gray-700" : ""}`}
          onClick={() => handleItemClick("/professor-materials")}
          role="menuitem"
          aria-label="Materialet"
        >
          <FaFileAlt className="menu-icon" />
          {isSidebarOpen && <span>Materialet</span>}
        </li>
        <li
          className={`menu-item ${location.pathname === "/professor-registrations" ? "bg-gray-700" : ""}`}
          onClick={() => handleItemClick("/professor-registrations")}
          role="menuitem"
          aria-label="Regjistrimet"
        >
          <FaClipboardList className="menu-icon" />
          {isSidebarOpen && <span>Regjistrimet</span>}
        </li>
        <li
          className={`menu-item ${location.pathname === "/professor-schedule" ? "bg-gray-700" : ""}`}
          onClick={() => handleItemClick("/professor-schedule")}
          role="menuitem"
          aria-label="Orari"
        >
          <FaCalendarAlt className="menu-icon" />
          {isSidebarOpen && <span>Orari</span>}
        </li>
        <li
          className={`menu-item ${location.pathname === "/professor-exams" ? "bg-gray-700" : ""}`}
          onClick={() => handleItemClick("/professor-exams")}
          role="menuitem"
          aria-label="Provimet"
        >
          <FaClipboardCheck className="menu-icon" />
          {isSidebarOpen && <span>Provimet</span>}
        </li>
        <li
          className={`menu-item ${location.pathname === "/professor-grades" ? "bg-gray-700" : ""}`}
          onClick={() => handleItemClick("/professor-grades")}
          role="menuitem"
          aria-label="Notat"
        >
          <FaPen className="menu-icon" />
          {isSidebarOpen && <span>Notat</span>}
        </li>
        <li
          className={`menu-item ${location.pathname === "/professor-faq" ? "bg-gray-700" : ""}`}
          onClick={() => handleItemClick("/professor-faq")}
          role="menuitem"
          aria-label="FAQ"
        >
          <FaQuestionCircle className="menu-icon" />
          {isSidebarOpen && <span>FAQ</span>}
        </li>
        <li
          className={`menu-item ${location.pathname === "/professor-settings" ? "bg-gray-700" : ""}`}
          onClick={() => handleItemClick("/professor-settings")}
          role="menuitem"
          aria-label="Cilësimet"
        >
          <FaCog className="menu-icon" />
          {isSidebarOpen && <span>Cilësimet</span>}
        </li>
        <li
          className={`menu-item ${location.pathname === "/" ? "bg-gray-700" : ""}`}
          onClick={() => handleItemClick("/")}
          role="menuitem"
          aria-label="Dil"
        >
          <FaSignOutAlt className="menu-icon" />
          {isSidebarOpen && <span>Dil</span>}
        </li>
      </ul>
      {isSidebarOpen && (
        <div className="professor-sidebar-user">
          <span className="sidebar-user-logo">{professorName.charAt(0).toUpperCase()}</span>
          <span className="professor-sidebar-user-text">{professorName}</span>
        </div>
      )}
    </nav>
  );
};

ProfessorSidebar.propTypes = {
  professorName: PropTypes.string,
  isSidebarOpen: PropTypes.bool,
};

ProfessorSidebar.defaultProps = {
  professorName: "Professor",
  isSidebarOpen: false,
};

export default ProfessorSidebar;