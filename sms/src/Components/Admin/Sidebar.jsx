import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt, FaUniversity, FaBuilding, FaProjectDiagram, FaUsers, FaUserCog,
  FaChalkboardTeacher, FaUserGraduate, FaBookOpen, FaFileAlt, FaClipboardList,
  FaCalendarAlt, FaClipboardCheck, FaPen, FaMoneyCheckAlt, FaQuestionCircle,
  FaCog, FaSignOutAlt
} from "react-icons/fa";

const Sidebar = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const STORAGE_KEY = "sidebarScroll";

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
        <div className="icon">🎓</div>
        <span>{isSidebarOpen ? "SMS 2025/26" : "SMS"}</span>
      </div>
      <ul className="admin-sidebar-menu" ref={menuRef}>
        <li onClick={() => handleItemClick("/admin-dashboard")} className="menu-item">
          <FaTachometerAlt className="menu-icon" />
          {isSidebarOpen && <span>Dashboard</span>}
        </li>
        <li onClick={() => handleItemClick("/admin-faculties")} className="menu-item">
          <FaUniversity className="menu-icon" />
          {isSidebarOpen && <span>Fakulteti</span>}
        </li>
        <li onClick={() => handleItemClick("/admin-departments")} className="menu-item">
          <FaBuilding className="menu-icon" />
          {isSidebarOpen && <span>Departamentet</span>}
        </li>
        <li onClick={() => handleItemClick("/admin-programs")} className="menu-item">
          <FaProjectDiagram className="menu-icon" />
          {isSidebarOpen && <span>Programet</span>}
        </li>
        <li onClick={() => handleItemClick("/admin-users")} className="menu-item">
          <FaUsers className="menu-icon" />
          {isSidebarOpen && <span>Përdoruesit</span>}
        </li>
        <li onClick={() => handleItemClick("/admin-manage-users")} className="menu-item">
          <FaUserCog className="menu-icon" />
          {isSidebarOpen && <span>Menaxho Përdoruesit</span>}
        </li>
        <li onClick={() => handleItemClick("/admin-professors")} className="menu-item">
          <FaChalkboardTeacher className="menu-icon" />
          {isSidebarOpen && <span>Profesorët</span>}
        </li>
        <li onClick={() => handleItemClick("/admin-students")} className="menu-item">
          <FaUserGraduate className="menu-icon" />
          {isSidebarOpen && <span>Studentët</span>}
        </li>
        <li onClick={() => handleItemClick("/admin-courses")} className="menu-item">
          <FaBookOpen className="menu-icon" />
          {isSidebarOpen && <span>Kurset</span>}
        </li>
        <li onClick={() => handleItemClick("/admin-registrations")} className="menu-item">
          <FaClipboardList className="menu-icon" />
          {isSidebarOpen && <span>Regjistrimet</span>}
        </li>

        <li onClick={() => handleItemClick("/admin-exams")} className="menu-item">
          <FaClipboardCheck className="menu-icon" />
          {isSidebarOpen && <span>Provimet</span>}
        </li>


        <li onClick={() => handleItemClick("/admin-scholarships")} className="menu-item">
          <FaMoneyCheckAlt className="menu-icon" />
          {isSidebarOpen && <span>Bursat</span>}
        </li>
        <li onClick={() => handleItemClick("/admin-faq")} className="menu-item">
          <FaQuestionCircle className="menu-icon" />
          {isSidebarOpen && <span>FAQ</span>}
        </li>
        <li onClick={() => handleItemClick("/admin-settings")} className="menu-item">
          <FaCog className="menu-icon" />
          {isSidebarOpen && <span>Cilësimet</span>}
        </li>
        <li onClick={() => handleItemClick("/")} className="menu-item">
          <FaSignOutAlt className="menu-icon" />
          {isSidebarOpen && <span>Logout</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
