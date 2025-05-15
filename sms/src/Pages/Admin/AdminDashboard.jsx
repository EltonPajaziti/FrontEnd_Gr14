import React, { useEffect, useState } from "react";
import '../../CSS/Admin/AdminDashboard.css';
import Sidebar from "../../Components/Admin/Sidebar";
import StatsCard from "../../Components/Admin/StatsCard";
import { Link } from "react-router-dom";
import Header from "../../Components/Admin/Header";


function AdminDashboard() {
  const [studentCount, setStudentCount] = useState(0);

  // useEffect(() => {
  //   const tenantId = localStorage.getItem("tenantId");

  //   if (tenantId) {
  //     fetch(`http://localhost:8080/api/students/by-tenant/${tenantId}`)
  //       .then((res) => res.json())
  //       .then((data) => setStudentCount(data.length))
  //       .catch((err) =>
  //         console.error("Gabim gjatë marrjes së studentëve:", err)
  //       );
  //   }
  // }, []);


  useEffect(() => {
  const tenantId = localStorage.getItem("tenantId");

  if (tenantId) {
    fetch(`/api/students/count/by-tenant/${tenantId}`) // proxy aktiv këtu
      .then((res) => res.json())
      .then((data) => setStudentCount(data))
      .catch((err) =>
        console.error("Gabim gjatë marrjes së numrit të studentëve:", err)
      );
  }
}, []);

  return (
    <div className="app-container">
      <div className="main-content">
        <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : 'closed'}`}>
          <Sidebar adminName={adminName} isSidebarOpen={isSidebarOpen} />
        </div>
        <div className={`content-wrapper ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Header adminName={adminName} toggleSidebar={toggleSidebar} />
          <div className="admin-dashboard">
            <div className="admin-dashboard-header">
              <div>
                <h2>{getGreeting()}, {adminName}</h2>
                <p>Manage faculty, students, and professors</p>
              </div>
              <Link to="/admin-add-user">
                <button className="add-user-btn">+Add User</button>
              </Link>
            </div>

          <div className="stats-grid">
            <StatsCard
              title="Studentë Total"
              value={studentCount}
              info="+12% nga tremujori i kaluar"
            />
            <StatsCard title="Profesorë" value="87" info="+4% nga viti i kaluar" />
            <StatsCard title="Kurse Aktive" value="156" info="0% ndryshim" />
            <StatsCard title="Departamente" value="12" info="↑ 1 departament i ri" />
          </div>

            <div className="content-grid">
              <div className="regjistrimi">
                <h3>Registration Statistics</h3>
                <div className="placeholder-graph">
                  Graphs and detailed statistics will be displayed here
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;