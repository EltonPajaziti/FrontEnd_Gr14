import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  FaCalendarAlt
} from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate(); // Mënyra moderne për navigim në React Router

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">SMS 2025/26</div>
      <ul className="admin-sidebar-menu">
        <li onClick={() => handleItemClick('/admin-dashboard')} className="menu-item"><FaTachometerAlt /> Dashboard</li>
        <li onClick={() => handleItemClick('/admin-faculties')} className="menu-item"><FaUniversity /> Fakulteti</li>
        <li onClick={() => handleItemClick('/admin-departments')} className="menu-item"><FaBuilding /> Departamentet</li>
        <li onClick={() => handleItemClick('/admin-programs')} className="menu-item"><FaProjectDiagram /> Programet</li>
        <li onClick={() => handleItemClick('/admin-users')} className="menu-item"><FaUsers /> Përdoruesit</li>
        <li onClick={() => handleItemClick('/admin-manage-users')} className="menu-item"><FaUserCog /> Menaxho Përdoruesit</li>
        <li onClick={() => handleItemClick('/admin-professors')} className="menu-item"><FaChalkboardTeacher /> Profesorët</li>
        <li onClick={() => handleItemClick('/admin-students')} className="menu-item"><FaUserGraduate /> Studentët</li>
        <li onClick={() => handleItemClick('/admin-courses')} className="menu-item"><FaBookOpen /> Kurset</li>
        <li onClick={() => handleItemClick('/admin-materials')} className="menu-item"><FaFileAlt /> Materialet</li>
        <li onClick={() => handleItemClick('/admin-registrations')} className="menu-item"><FaClipboardList /> Regjistrimet</li>
        <li onClick={() => handleItemClick('/admin-schedule')} className="menu-item"><FaCalendarAlt /> Orari</li>
      </ul>

      <div className='admin-sidebar-user'>
        <div className='admin-sidebar-user-photo'>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="55" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
          </svg>
        </div>
        <div className='admin-sidebar-user-text'>
          Admin user
          <br />ADMIN
        </div>
      </div>

      <style jsx>{`
        .menu-item {
          padding: 10px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .menu-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .menu-item:active {
          background-color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
