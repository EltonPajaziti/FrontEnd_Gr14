import React from 'react';
import { FaHome, FaBook, FaUsers, FaFileAlt, FaCalendarAlt, FaClock, FaClipboardList, FaPen, FaFileSignature, FaQuestionCircle, FaCog, FaGraduationCap } from 'react-icons/fa';
import { MdOutlineSchool } from 'react-icons/md';
import '../../CSS/Professor/ProfessorSidebar.css';

function ProfessorSidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>📘 SEMS 2024/25</h2>
      </div>
      <ul className="sidebar-menu">
        <li><FaHome /> Dashboard</li>
        <li><MdOutlineSchool /> Programet</li>
        <li><FaUsers /> Studentët</li>
        <li><FaBook /> Kurset</li>
        <li><FaFileAlt /> Materialet</li>
        <li><FaClipboardList /> Regjistrimet</li>
        <li><FaCalendarAlt /> Orari</li>
        <li><FaClock /> Orari i Leksioneve</li>
        <li><FaClipboardList /> Provimet</li>
        <li><FaPen /> Notat</li>
        <li><FaFileSignature /> Transkriptet</li>
        <li><FaGraduationCap /> Bursat</li>
        <li><FaQuestionCircle /> FAQ</li>
        <li><FaCog /> Cilësimet</li>
      </ul>

      <div className="sidebar-footer">
        <div className="profile-box">
          <span className="profile-initials">PS</span>
          <div>
            <strong>Professor Smith</strong>
            <p className="role">PROFESSOR</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default ProfessorSidebar;

