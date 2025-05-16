import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardCards from './DashboardCards'
import GradesToSet from './GradesToSet';
import CurrentCourses from './CurrentCourses';
import '../../CSS/Professor/ProfessorDashboard.css';




function ProfessorDashboard() {
  return (
   <div className="dashboard-container">
  <Sidebar />
  <div className="dashboard-content">
    <Header />
    <DashboardCards />
    
    <div className="dashboard-main-sections">
      <CurrentCourses />
      <GradesToSet />
    </div>
  </div>
</div>

  );
}

export default ProfessorDashboard;
