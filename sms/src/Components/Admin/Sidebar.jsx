import React from 'react';
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
  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">SMS 2025/26</div>
      <ul className="admin-sidebar-menu">
        <li><FaTachometerAlt /> Dashboard</li>
        <li><FaUniversity /> Fakulteti</li>
        <li><FaBuilding /> Departamentet</li>
        <li><FaProjectDiagram /> Programet</li>
        <li><FaUsers /> Përdoruesit</li>
        <li><FaUserCog /> Menaxho Përdoruesit</li>
        <li><FaChalkboardTeacher /> Profesorët</li>
        <li><FaUserGraduate /> Studentët</li>
        <li><FaBookOpen /> Kurset</li>
        <li><FaFileAlt /> Materialet</li>
        <li><FaClipboardList /> Regjistrimet</li>
        <li><FaCalendarAlt /> Orari</li>
      </ul>
      <div className='admin-sidebar-user'>
        <div className='admin-sidebar-user-photo'>
<svg xmlns="http://www.w3.org/2000/svg" width="50" height="55" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
</svg>       
       
        </div>
        <div className='admin-sidebar-user-text'>
            Admin user
            <br />ADMIN
            
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
