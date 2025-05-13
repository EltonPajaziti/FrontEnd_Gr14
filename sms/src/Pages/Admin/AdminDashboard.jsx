import React, { useEffect, useState } from "react";
import '../../CSS/Admin/AdminDashboard.css';
import Sidebar from "../../Components/Admin/Sidebar";
import LatestRequests from "../../Components/Admin/LatestRequests";
import StatsCard from "../../Components/Admin/StatsCard";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    const tenantId = localStorage.getItem("tenantId");

    if (tenantId) {
      fetch(`http://localhost:8080/api/students/by-tenant/${tenantId}`)
        .then((res) => res.json())
        .then((data) => setStudentCount(data.length))
        .catch((err) =>
          console.error("Gabim gjatë marrjes së studentëve:", err)
        );
    }
  }, []);

  return (
    <>
      <div className="app-container">
        <Sidebar />
        <div className="admin-dashboard">
          <div className="admin-dashboard-header">
            <div>
              <h2>Mirëmbrema, Admin User</h2>
              <p>Menaxhoni fakultetin, studentët dhe profesorët</p>
            </div>
            <Link to="/admin-add-user">
              <button className="add-user-btn">Shto Përdorues</button>
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
              <h3>Statistikat e Regjistrimit</h3>
              <div className="placeholder-graph">
                Grafikët dhe statistikat e detajuara do të shfaqen këtu
              </div>
            </div>
            <LatestRequests />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
