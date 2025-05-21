import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome, FaBook, FaUsers, FaFileAlt, FaClipboardList,
  FaPen, FaCog, FaClock
} from 'react-icons/fa';
import { MdOutlineSchool } from 'react-icons/md';
import '../../CSS/Professor/ProfessorSidebar.css';

function ProfessorSidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>SMS<br />2024/25</h2>
      </div>

      <ul className="sidebar-menu">
        <li><Link to="/professor-dashboard"><FaHome /> Dashboard</Link></li>
        <li><Link to="/professor-students"><FaUsers /> Studentët</Link></li>
      {/*}  <li><Link to="/professor-courses"><FaBook /> Kurset</Link></li> */}
        <li><Link to="/professor-materials"><FaFileAlt /> Materialet</Link></li>
     {/*   <li><Link to="/professor-registrations"><FaClipboardList /> Regjistrimet</Link></li> */}
        <li><Link to="/professor-lectures"><FaClock /> Orari i Leksioneve</Link></li>
        <li><Link to="/professor-exams"><FaClipboardList /> Provimet</Link></li>
        <li><Link to="/professor-grades"><FaPen /> Notat</Link></li>
        <li><Link to="/professor-settings"><FaCog /> Cilësimet</Link></li>
      </ul>

      <div className="sidebar-footer">
        <div className="profile-box">
          
          </div>
        </div>
      
    </aside>
  );
}

export default ProfessorSidebar;
