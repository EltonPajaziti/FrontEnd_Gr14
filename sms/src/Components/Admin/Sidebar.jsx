import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUniversity,
  FaBuilding,
  FaProjectDiagram,
  FaUsers,
  FaUserCog,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBookOpen,
  FaFileAlt,
  FaClipboardList,
  FaCalendarAlt,
} from "react-icons/fa";

const Sidebar = ({ isSidebarOpen }) => {
  const navigate = useNavigate();

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <div className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="admin-sidebar-header">
        <div className="icon">🎓</div>
        <span>{isSidebarOpen ? "SMS 2025/26" : "SMS"}</span>
      </div>
      <ul className="admin-sidebar-menu">
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
        <li onClick={() => handleItemClick("/admin-materials")} className="menu-item">
          <FaFileAlt className="menu-icon" />
          {isSidebarOpen && <span>Materialet</span>}
        </li>
        <li onClick={() => handleItemClick("/admin-registrations")} className="menu-item">
          <FaClipboardList className="menu-icon" />
          {isSidebarOpen && <span>Regjistrimet</span>}
        </li>
        <li onClick={() => handleItemClick("/admin-schedule")} className="menu-item">
          <FaCalendarAlt className="menu-icon" />
          {isSidebarOpen && <span>Orari</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;