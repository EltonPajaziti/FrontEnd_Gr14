import React, { useEffect, useState } from "react";
import '../../CSS/Admin/AdminDashboard.css';
import Sidebar from "../../Components/Admin/Sidebar";
import StatsCard from "../../Components/Admin/StatsCard";
import { Link } from "react-router-dom";
import Header from "../../Components/Admin/Header";


function AdminDashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [professorCount, setProfessorCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  
  const [adminName, setAdminName] = useState('Admin User');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const getGreeting = () => {
    const currentHour = currentTime.getHours();
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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

    const fetchAdminName = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8080/api/auth/user', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          setAdminName(data.firstName || data.name || 'Admin User');
        } catch (error) {
          console.error("Error fetching admin name:", error);
          setAdminName('Admin User');
        }
      }
    };

    fetchAdminName();

    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
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
                title="Total Students"
                value={studentCount}
                info="+12% from the previous quarter"
              />
              <StatsCard title="Professors" value={professorCount} info="+4% from last year" />
              <StatsCard title="Active Courses" value={courseCount} info="0% change" />
              <StatsCard title="Departments" value={departmentCount} info="↑ 1 new department" />
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