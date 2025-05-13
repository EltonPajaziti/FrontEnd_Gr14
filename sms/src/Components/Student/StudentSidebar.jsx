import React from 'react';
import '../../CSS/Student/StudentSidebar.css';
import { FaBook, FaFileAlt, FaClock, FaCalendarCheck, FaClipboard, FaGraduationCap, FaQuestionCircle, FaCog } from 'react-icons/fa';

function StudentSidebar() {
  return (
    <nav className="sidebar">
      <div className="logo">
        <h2>📘 SMS 2025/26</h2>
      </div>
      <ul className="nav-list">
        <li><a href="#"><FaClock /> Dashboard</a></li>
        <li><a href="#"><FaBook /> Kurset</a></li>
        <li><a href="#"><FaFileAlt /> Materialet</a></li>
        <li><a href="#"><FaClock /> Orari</a></li>
        <li><a href="#"><FaCalendarCheck /> Orari i Leksioneve</a></li>
        <li><a href="#"><FaClipboard /> Provimet</a></li>
        <li><a href="#"><FaGraduationCap /> Notat</a></li>
        <li><a href="#"><FaGraduationCap /> Bursat</a></li>
        <li><a href="#"><FaQuestionCircle /> FAQ</a></li>
        <li><a href="#"><FaCog /> Cilësimet</a></li>
      </ul>
      <div className="profile-section">
        <div className="profile-infos">
          <div className="avatar">SJ</div>
          <div>
            <p className="name">Student Johnson</p>
            <p className="role">STUDENT</p>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default StudentSidebar;
