import React from "react";
import '../CSS/AdminDashboard.css';
import Sidebar from "../Components/Sidebar";
import LatestRequests from "../Components/LatestRequests";
import StatsCard from "../Components/StatsCard";


function AdminDashboard(){
return(
    <>
    <div className="app-container">
    <Sidebar/>
 <div className="dashboard">
    <div className="dashboard-header">
      <div>
        <h2>Mirëmbrema, Admin User</h2>
        <p>Menaxhoni fakultetin, studentët dhe profesorët</p>
      </div>
      <button className="add-user-btn">Shto Përdorues</button>
    </div>
          <div className="stats-grid">
        <StatsCard title="Studentë Total" value="1,245" info="+12% nga tremujori i kaluar" />
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

)
}


export default AdminDashboard;