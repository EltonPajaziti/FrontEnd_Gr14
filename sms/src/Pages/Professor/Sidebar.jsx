// ================= Sidebar.jsx =================
import React from 'react';
import '../../CSS/Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">Sistemi i Shpërndarjes | 2024/25</h2>
      <ul className="sidebar-menu">
        <li>Dashboard</li>
        <li>Kurse</li>
        <li>Studentë</li>
        <li>Materiale</li>
        <li>Notat</li>
        <li>Provimet</li>
        <li>Cilësimet</li>
      </ul>
    </div>
  );
}

export default Sidebar;