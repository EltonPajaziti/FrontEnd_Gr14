import React from 'react';
import '../../CSS/Student/StudentSidebar.css';
import { Link } from 'react-router-dom';
import { FaBook, FaFileAlt, FaClock, FaCalendarCheck, FaClipboard, FaGraduationCap, FaQuestionCircle, FaCog } from 'react-icons/fa';

function StudentSidebar() {
  return (
    <nav className="sidebar">
      <div className="logo">
        <h2>📘 SMS 2025/26</h2>
      </div>
      <ul className="nav-list">
    <li><Link to="/"><FaClock /> Dashboard</Link></li>
        <li><Link to="/kurset"><FaBook /> Kurset</Link></li>
        <li><Link to="/ParaqitProvimet"><FaClipboard /> Provimet</Link></li>
        <li><Link to="/notat"><FaGraduationCap /> Notat</Link></li>
        <li><Link to="/bursat"><FaGraduationCap /> Bursat</Link></li>
        <li><Link to="/faq"><FaQuestionCircle /> FAQ</Link></li>
        <li><Link to="/cilesimet"><FaCog /> Cilësimet</Link></li>
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
