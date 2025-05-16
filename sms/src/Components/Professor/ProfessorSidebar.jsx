import React from "react";
import "../../CSS/ProfessorSidebar.css";
import { FaHome, FaBook, FaUserGraduate, FaClipboard, FaFileAlt, FaEdit, FaCalendarAlt, FaChalkboardTeacher, FaTasks, FaPencilAlt, FaTable, FaGraduationCap, FaQuestionCircle, FaCog } from "react-icons/fa";

function ProfessorSidebar() {
  return (
    <aside className="professor-sidebar">
      <div className="logo-section">
        <h2>📘 SEMS 2024/25</h2>
      </div>
      <ul className="sidebar-links">
        <li><FaHome /> Dashboard</li>
        <li><FaBook /> Programet</li>
        <li><FaUserGraduate /> Studentët</li>
        <li><FaClipboard /> Kurset</li>
        <li><FaFileAlt /> Materialet</li>
        <li><FaEdit /> Regjistrimet</li>
        <li><FaCalendarAlt /> Orari</li>
        <li><FaChalkboardTeacher /> Orari i Leksioneve</li>
        <li><FaTasks /> Provimet</li>
        <li><FaPencilAlt /> Notat</li>
        <li><FaTable /> Transkriptet</li>
        <li><FaGraduationCap /> Bursat</li>
        <li><FaQuestionCircle /> FAQ</li>
        <li><FaCog /> Cilësimet</li>
      </ul>
      <div className="professor-info">
        <div className="avatar">PS</div>
        <div>
          <p className="name">Professor Smith</p>
          <span className="role">PROFESSOR</span>
        </div>
      </div>
    </aside>
  );
}

export default ProfessorSidebar;
