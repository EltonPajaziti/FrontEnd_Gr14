import React, { useEffect, useState } from "react";
import '../../CSS/Admin/AdminDashboard.css';
import Sidebar from "../../Components/Admin/Sidebar";
import LatestRequests from "../../Components/Admin/LatestRequests";
import StatsCard from "../../Components/Admin/StatsCard";
import { Link } from "react-router-dom";


function AdminDashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [professorCount, setProfessorCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);

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
  if (!tenantId) return;

  fetch(`/api/students/count/by-tenant/${tenantId}`)
    .then(res => res.json())
    .then(data => setStudentCount(data))
    .catch(err => console.error(err));

  fetch(`/api/professors/count/by-tenant/${tenantId}`)
    .then(res => res.json())
    .then(data => setProfessorCount(data))
    .catch(err => console.error(err));

  fetch(`/api/courses/count/by-tenant/${tenantId}`)
    .then(res => res.json())
    .then(data => setCourseCount(data))
    .catch(err => console.error(err));

  fetch(`/api/departments/count/by-tenant/${tenantId}`)
    .then(res => res.json())
    .then(data => setDepartmentCount(data))
    .catch(err => console.error(err));    
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
            <StatsCard title="Studentë Total" value={studentCount} info="↑ 1 student i ri"/>
            <StatsCard title="Profesorë" value={professorCount} info="↑ 1 profesor i ri" />
            <StatsCard title="Kurse Aktive" value={courseCount} info="0% ndryshim" />
            <StatsCard title="Departamente" value={departmentCount} info="↑ 1 departament i ri" />
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
